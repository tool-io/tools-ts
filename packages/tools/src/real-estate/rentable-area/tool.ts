import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RentableAreaInput = Readonly<{
  readonly usableSquareFeet: number;
  readonly loadFactorPercent: number;
}>;
export type RentableAreaOutput = Readonly<{
  readonly rentableSquareFeet: number;
}>;

export const calculateRentableArea = (
  x: RentableAreaInput,
): RentableAreaOutput => {
  if (!Number.isFinite(x.usableSquareFeet) || x.usableSquareFeet < 0)
    simpleError("usableSquareFeet", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.loadFactorPercent) || x.loadFactorPercent < 0)
    simpleError("loadFactorPercent", "Provide a finite nonnegative number.");
  const rentableSquareFeet =
    x.usableSquareFeet * (1 + x.loadFactorPercent / 100);
  if (!Number.isFinite(rentableSquareFeet))
    simpleError(
      "rentableSquareFeet",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    rentableSquareFeet: Object.is(rentableSquareFeet, -0)
      ? 0
      : rentableSquareFeet,
  };
};

export const example = {
  input: {
    usableSquareFeet: 10000,
    loadFactorPercent: 10,
  },
  output: { rentableSquareFeet: 11000 },
} satisfies ToolExample<RentableAreaInput, RentableAreaOutput>;

export const tool = createSimpleTool({
  id: "real-estate/rentable-area",
  title: "Rentable Area",
  description:
    "Rentable floor area from usable area and load factor measured relative to usable area.",
  inputs: [
    {
      id: "usableSquareFeet",
      kind: "number",
      label: "Usable Square Feet",
      unit: "ft2",
      minimum: 0,
    },
    {
      id: "loadFactorPercent",
      kind: "number",
      label: "Load Factor Percent",
      unit: "percent",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "rentableSquareFeet",
      kind: "number",
      label: "Rentable Square Feet",
      unit: "ft2",
    },
  ],
  calculate: (input) =>
    calculateRentableArea({
      usableSquareFeet: input.usableSquareFeet as number,
      loadFactorPercent: input.loadFactorPercent as number,
    }),
});
export const rentableAreaTool = tool;
export const runRentableArea = tool.execute;
export default tool;
