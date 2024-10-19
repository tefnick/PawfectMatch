import React from 'react'
import ListsTab from './ListsTab'
import { fetchCurrentUserLikeIds, fetchLikedDogs } from '../actions/likeActions'

export default async function ListsPage({ searchParams }: 
  { searchParams: { type: string } }
) {
  const likeIds = await fetchCurrentUserLikeIds();
  const dogs = await fetchLikedDogs(searchParams.type)

  return (
    <div>
      <ListsTab dogs={dogs} likeIds={likeIds}/>
    </div>

  )
}
