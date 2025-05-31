"use client";

import { MessageDTO } from '@/types';
import {
  Avatar,
  Button,
  Card, getKeyValue, Table, TableBody, TableCell,
  TableColumn, TableHeader, TableRow
} from '@nextui-org/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Key, useCallback, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai';
import { deleteMessage } from '../actions/messageActions';
import { truncateString } from '@/lib/util';

type MessageTableProps = {
  messages: MessageDTO[]
}

export default function MessageTable({ messages }: MessageTableProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isOutbox = searchParams.get('container') === "outbox";
  const [isDeleting, setIsDeleting] = useState({id: '', loading: false});

  const columns = [
    { key: isOutbox ? 'recipientName' : 'senderName', label: isOutbox ? 'Recipient' : 'Sender' },
    { key: 'text', label: 'Message' },
    { key: 'created', label: isOutbox ? 'Date sent' : 'Date received' },
    { key: 'actions', label: 'actions' },
  ]

  const handleRowSelect = (key: Key) => {
    const message = messages.find(m => m.id === key);
    const url = isOutbox ? `/dogs/${message?.recipientId}` : `/dogs/${message?.senderId}`;
    router.push(url + '/chat');
  }

  const handleDeleteMessage = useCallback(async (message: MessageDTO) => {
    setIsDeleting({id: message.id, loading: true})
    await deleteMessage(message.id, isOutbox);
    router.refresh();
    setIsDeleting({id: '', loading: false})
  }, [isOutbox, router]);

  const renderCell = useCallback((item: MessageDTO, columnKey: keyof MessageDTO) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case 'recipientName':
      case 'senderName':
        return (
          <div className='flex items-center gap-2 cursor-pointer'>
            <Avatar 
              alt="image of dog" 
              src={(isOutbox ? item.recipientImage : 
                  item.senderImage) || '/images/user.png'}
            />
            <span>{cellValue}</span>
          </div>
        )
      case 'text':
        return (
          <div>
            {truncateString(cellValue, 80)}
          </div>
        )
      case 'created':
        return (
          cellValue
        )
      default:
        return (
          <Button 
            isIconOnly 
            variant="light"
            onClick={() => handleDeleteMessage(item)}
            isLoading={isDeleting.id === item.id && isDeleting.loading}
          >
            <AiFillDelete size={24} className='text-danger'/>
          </Button>
        )
    }

  }, [isOutbox, isDeleting.id, isDeleting.loading, handleDeleteMessage])

  return (
    <Card className='flex flex-col gap-3 h-[80vh] overflow-auto'>
      <Table
        aria-label="Table of messages"
        selectionMode='single'
        onRowAction={(key) => handleRowSelect(key)}
        shadow='none'
      >
        <TableHeader columns={columns}>
          {(column) => 
            <TableColumn 
              key={column.key}
              width={column.key === "text" ? "50%" : undefined}
            >
              {column.label}
            </TableColumn>}
        </TableHeader>
        <TableBody items={messages} emptyContent="No messages found">
          {(item) => (
            <TableRow key={item.id} className='cursor-pointer'>
              {(columnKey) => 
                <TableCell className={`${!item.dateRead && !isOutbox ? 'font-semibold' : ''}`}>
                  {renderCell(item, columnKey as keyof MessageDTO)}
                </TableCell>
              }
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
