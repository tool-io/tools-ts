import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RentableToUsableRatioInput = Readonly<{
  readonly rentableSquareFeet: number;
  readonly usableSquareFeet: number;
}>;
export type RentableToUsableRatioOutput = Readonly<{
  readonly rentableToUsableRatio: number;
}>;

export const calculateRentableToUsableRatio = (
  x: RentableToUsableRatioInput,
): RentableToUsableRatioOutput => {
  if (!Number.isFinite(x.rentableSquareFeet) || x.rentableSquareFeet <= 0)
    simpleError("rentableSquareFeet", "Provide a finite positive number.");
  if (!Number.isFinite(x.usableSquareFeet) || x.usableSquareFeet <= 0)
    simpleError("usableSquareFeet", "Provide a finite positive number.");
  if (!(x.rentableSquareFeet >= x.usableSquareFeet))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const rentableToUsableRatio = x.rentableSquareFeet / x.usableSquareFeet;
  if (!Number.isFinite(rentableToUsableRatio))
    simpleError(
      "rentableToUsableRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    rentableToUsableRatio: Object.is(rentableToUsableRatio, -0)
      ? 0
      : rentableToUsableRatio,
  };
};

export const example = {
  input: {
    rentableSquareFeet: 11000,
    usableSquareFeet: 10000,
  },
  output: { rentableToUsableRatio: 1.1 },
} satisfies ToolExample<
  RentableToUsableRatioInput,
  RentableToUsableRatioOutput
>;

export const tool = createSimpleTool({
  id: "real-estate/rentable-to-usable-ratio",
  title: "Rentable To Usable Ratio",
  description: "Rentable floor area divided by usable floor area.",
  inputs: [
    {
      id: "rentableSquareFeet",
      kind: "number",
      label: "Rentable Square Feet",
      unit: "ft2",
      minimum: 0,
    },
    {
      id: "usableSquareFeet",
      kind: "number",
      label: "Usable Square Feet",
      unit: "ft2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "rentableToUsableRatio",
      kind: "number",
      label: "Rentable To Usable Ratio",
    },
  ],
  calculate: (input) =>
    calculateRentableToUsableRatio({
      rentableSquareFeet: input.rentableSquareFeet as number,
      usableSquareFeet: input.usableSquareFeet as number,
    }),
});
export const rentableToUsableRatioTool = tool;
export const runRentableToUsableRatio = tool.execute;
export default tool;
