export type Programme = {
  _id: string;
  modeName: "Distance MBA" | "Online MBA" | "Executive MBA" | "Correspondence MBA";
  slug: string;
  summary: string;
  feeRange: string;
  durationLabel: string;
  formatLabel: string;
  bestFor: string;
  order?: number;
};
