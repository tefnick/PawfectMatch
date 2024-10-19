import Link from 'next/link'
import React from 'react'
import { getDogs } from '../actions/dogActions'
import DogCard from './DogCard';
import { fetchCurrentUserLikeIds } from '../actions/likeActions';

export default async function DogsPage() {
  const dogs = await getDogs();
  const likeIds = await fetchCurrentUserLikeIds();

  return (
    <div className='mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8'>
      {dogs && dogs.map((dog) => (
        <DogCard key={dog.id} dog={dog} likeIds={likeIds}/>
      ))}
    </div>
  )
}
