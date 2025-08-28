import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, use, useTransition } from "react";
import { FaFemale, FaMale } from "react-icons/fa";
import useFilterStore from "./useFilterStore";
import { Selection } from "@nextui-org/react";

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

  const { gender, ageRange, orderBy } = filters;

  useEffect(() => {
    startTransition(() => {
      const searchParams = new URLSearchParams();

      if (gender) searchParams.set("gender", gender.join(","));
      if (ageRange) searchParams.set("ageRange", ageRange.toString());
      if (orderBy) searchParams.set("orderBy", orderBy);

      router.replace(`${pathName}?${searchParams}`);
    })
    
  }, [ageRange, orderBy, gender, router, pathName])

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

  console.log('filters', {filters})

  return {
    orderByList,
    genderList,
    selectAge: handleAgeSelect,
    selectGender: handleGenderSelect,
    selectOrder: handleOrderSelect,
    filters,
    clientLoaded,
    isPending
  }
}