export function toSearchParams(
  searchParamsObject: Record<
    string,
    string | number | bigint | boolean | undefined | null
  >,
  initialSearchParams?: URLSearchParams | string,
): URLSearchParams {
  const searchParams = initialSearchParams
    ? new URLSearchParams(initialSearchParams)
    : new URLSearchParams();

  Object.entries(searchParamsObject).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, String(value));
    }
  });

  return searchParams;
}
