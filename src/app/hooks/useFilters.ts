import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, use, useTransition, ChangeEvent } from "react";
import { FaFemale, FaMale } from "react-icons/fa";
import useFilterStore from "./useFilterStore";
import { Selection } from "@nextui-org/react";
import usePaginationStore from "./usePaginationStore";

export const useFilters = () => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [clientLoaded, setClientLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setClientLoaded(true);
  }, [])

  const { filters, setFilters} = useFilterStore()
  const { gender, ageRange, orderBy, withPhoto } = filters;
  
  const { pageNumber, pageSize, totalCount } = usePaginationStore(state => state.pagination)
  const { setPage } = usePaginationStore()
  

  useEffect(() => {
    if (gender || ageRange || orderBy || withPhoto) {
      setPage(1)
    }
  },[ageRange, gender, orderBy, setPage, withPhoto])

  useEffect(() => {
    startTransition(() => {
      const searchParams = new URLSearchParams();

      if (gender) searchParams.set("gender", gender.join(","));
      if (ageRange) searchParams.set("ageRange", ageRange.toString());
      if (orderBy) searchParams.set("orderBy", orderBy);
      if (pageSize) searchParams.set("pageSize", pageSize.toString())
      if (pageNumber) searchParams.set("pageNumber", pageNumber.toString())
      searchParams.set("withPhoto", withPhoto.toString());

      router.replace(`${pathName}?${searchParams}`);
    })
    
  }, [ageRange, orderBy, gender, router, pathName, pageNumber, pageSize, withPhoto])

  const orderByList = [
    {label: 'Last active', value: 'updatedAt'},
    {label: 'Newest dogs', value: 'createdAt'},
  ];

  const genderList = [
    {value: 'male', icon: FaMale},
    {value: 'female', icon: FaFemale},
  ];


  const handleAgeSelect = (value: number[]) => {
    setFilters("ageRange", value)
  }

  const handleOrderSelect = (value: Selection) => {
    if (value instanceof Set) {
      setFilters("orderBy", value.values().next().value)
    }
  }

  const handleGenderSelect = (value: string) => {
		if (gender.includes(value)) setFilters('gender', gender.filter((g) => g !== value));
		else setFilters('gender', [...gender, value]);
	};

  const handleWithPhotoToggle = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters("withPhoto", e.target.checked)
  }

  console.log('filters', {filters})

  return {
    orderByList,
    genderList,
    selectAge: handleAgeSelect,
    selectGender: handleGenderSelect,
    selectOrder: handleOrderSelect,
    selectWithPhoto: handleWithPhotoToggle,
    filters,
    clientLoaded,
    isPending,
    totalCount
  }
}