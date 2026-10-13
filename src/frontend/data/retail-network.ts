import rows from "./retail-network.json";

// Keep the master intact; only locations with stores appear in public browsing.
// When a district gains stores in the master, it appears automatically.
export const retailNetwork = rows.filter((row) => row.stores > 0);

export const networkStores = retailNetwork.reduce((total, row) => total + row.stores, 0);
export const networkDistricts = new Set(retailNetwork.map((row) => `${row.state}:${row.district}`)).size;

// The '+' figure is a conservative lower bound, not an upward-rounded estimate.
export function storeFigure(count: number) {
  return count < 50 ? count.toLocaleString("en-IN") : `${(Math.floor(count / 50) * 50).toLocaleString("en-IN")}+`;
}

export const totalStoreFigure = storeFigure(networkStores);
export const districtFigure = String(networkDistricts);