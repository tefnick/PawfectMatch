"use client";

import { MessageDTO } from '@/types';
import {
  Button,
  Card, Table, TableBody, TableCell,
  TableColumn, TableHeader, TableRow
} from '@nextui-org/react'
import React from 'react'
import MessageTableCell from './MessageTableCell';
import { useMessages } from '../hooks/useMessages';

type MessageTableProps = {
  initialMessages: MessageDTO[];
  nextCursor?: string;
}

export default function MessageTable({ initialMessages, nextCursor }: MessageTableProps) {
  const { columns, isOutbox, isDeleting, deleteMessage,
    selectRow, messages, loadMore, loadingMore, hasMore } = useMessages(initialMessages, nextCursor);

  return (
    <div className='flex flex-col h-[80vh]'>
      <Card >
        <Table
          aria-label="Table of messages"
          selectionMode='single'
          //@ts-ignore
          onRowAction={(key) => selectRow(key)}
          shadow='none'
          className='flex flex-col gap-3 h-[80vh] overflow-auto'
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
                    <MessageTableCell
                      item={item}
                      columnKey={columnKey as string}
                      isOutbox={isOutbox}
                      deleteMessage={deleteMessage}
                      isDeleting={isDeleting.loading && isDeleting.id === item.id}
                    />
                  </TableCell>
                }
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className='sticky bottom-0 pb-3 mr-3 text-right'>
          <Button
            color='secondary'
            isLoading={loadingMore}
            isDisabled={!hasMore}
            onClick={loadMore}
          >
            {hasMore ? "Load more messages " : "All caught up!"}
          </Button>

        </div>
      </Card>
    </div>

  )
}
