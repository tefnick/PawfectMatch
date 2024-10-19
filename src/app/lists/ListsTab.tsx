"use client";

import { Tabs, Tab } from '@nextui-org/react';
import { Dog } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Key, useTransition } from 'react'
import DogCard from '../dogs/DogCard';
import LoadingComponent from '@/components/LoadingComponent';

type Props = {
  dogs: Dog[];
  likeIds: string[];
}

export default function ListsTab({ dogs, likeIds }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const tabs = [
    { id: 'source', label: 'Dogs I have Liked' },
    { id: 'target', label: 'Dogs that Like Me' },
    { id: 'mutual', label: 'Mutual Likes' },
  ]

  // updates url search params when tab is changed
  function handleTabChange(key: Key): void {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.set('type', key.toString());
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className='flex w-full flex-col mt-10 gap-5'>
      <Tabs
        aria-label='Like tabs'
        items={tabs}
        color='secondary'
        onSelectionChange={(key) => handleTabChange(key)}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {isPending ? (
              <LoadingComponent />
            ) :
              <>
                {dogs.length > 0 ? (
                  <div className='mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8'>
                    {dogs.map((dog) => (
                      <DogCard key={dog.id} dog={dog} likeIds={likeIds} />
                    ))}
                  </div>
                ) : (
                  <div>No dogs for this filter</div>
                )}
              </>
            }

          </Tab>
        )}
      </Tabs>
    </div>

  )
}
