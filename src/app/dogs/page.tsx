import Link from 'next/link'
import React from 'react'
import { getDogs } from '../actions/dogActions'
import DogCard from './DogCard';

export default async function DogsPage() {
  const dogs = await getDogs();

  return (
    <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8'>
      {dogs && dogs.map((dog) => (
        <DogCard key={dog.id} dog={dog} />
      ))}
    </div>
  )
}
