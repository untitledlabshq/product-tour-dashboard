export function shortAddress(address: string) {
  if (address.length < 42) return address;
  return address.slice(0, 4) + "..." + address.slice(-4);
}
