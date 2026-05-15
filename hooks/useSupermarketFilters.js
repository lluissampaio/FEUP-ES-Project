import { useMemo, useState } from "react";

export const DISTANCE_OPTIONS = [
  { label: "Distância", value: null },
  { label: "< 1 km", value: 1 },
  { label: "< 3 km", value: 3 },
  { label: "< 5 km", value: 5 },
  { label: "< 10 km", value: 10 },
];

export function useSupermarketFilters(supermarkets) {
  const [query, setQuery] = useState("");
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState(null);

  const filteredData = useMemo(() => {
    return supermarkets
      .filter((s) => s.name.toLowerCase().includes(query.trim().toLowerCase()))
      .filter((s) => (isOpenFilter ? s.isOpen : true))
      .filter((s) =>
        distanceFilter !== null
          ? s.rawDistance !== null && s.rawDistance <= distanceFilter
          : true,
      );
  }, [supermarkets, query, isOpenFilter, distanceFilter]);

  return {
    query,
    setQuery,
    isOpenFilter,
    setIsOpenFilter,
    distanceFilter,
    setDistanceFilter,
    filteredData,
  };
}
