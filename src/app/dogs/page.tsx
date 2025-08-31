import React from "react";
import { getDogs } from "../actions/dogActions";
import DogCard from "./DogCard";
import { fetchCurrentUserLikeIds } from "../actions/likeActions";
import PaginationComponent from "@/components/PaginationComponent";
import { GetDogParams } from "@/types";
import EmptyState from "@/components/EmptyState";

export default async function DogsPage({
  searchParams,
}: {
  searchParams: GetDogParams;
}) {
  const { items: dogs, totalCount } = await getDogs(searchParams);
  const likeIds = await fetchCurrentUserLikeIds();

  return (
    <>
      {!dogs || dogs.length === 0 ? (
        <EmptyState
          customText="There are no results for this filter"
          customBodyText="Please select a different filter"
        />
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
            {dogs &&
              dogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} likeIds={likeIds} />
              ))}
          </div>
          <PaginationComponent totalCount={totalCount} />
        </>
      )}
    </>
  );
}
