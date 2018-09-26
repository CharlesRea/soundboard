export const mapToObject = <U>(items: number[], mapItem: (item: number) => U): { [key: number]: U } => {
  return Object.assign({}, ...items.map(input => ({[input]: mapItem(input)})));
};
