import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LoadFactorInput = Readonly<{
  readonly rentableSquareFeet: number;
  readonly usableSquareFeet: number;
}>;
export type LoadFactorOutput = Readonly<{
  readonly loadFactorPercent: number;
}>;

export const calculateLoadFactor = (x: LoadFactorInput): LoadFactorOutput => {
  if (!Number.isFinite(x.rentableSquareFeet) || x.rentableSquareFeet <= 0)
    simpleError("rentableSquareFeet", "Provide a finite positive number.");
  if (!Number.isFinite(x.usableSquareFeet) || x.usableSquareFeet <= 0)
    simpleError("usableSquareFeet", "Provide a finite positive number.");
  if (!(x.rentableSquareFeet >= x.usableSquareFeet))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const loadFactorPercent =
    (100 * (x.rentableSquareFeet - x.usableSquareFeet)) / x.usableSquareFeet;
  if (!Number.isFinite(loadFactorPercent))
    simpleError(
      "loadFactorPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    loadFactorPercent: Object.is(loadFactorPercent, -0) ? 0 : loadFactorPercent,
  };
};

export const example = {
  input: {
    rentableSquareFeet: 11000,
    usableSquareFeet: 10000,
  },
  output: { loadFactorPercent: 10 },
} satisfies ToolExample<LoadFactorInput, LoadFactorOutput>;

export const tool = createSimpleTool({
  id: "real-estate/load-factor",
  title: "Load Factor",
  description:
    "Load factor percentage: rentable area above usable area divided by usable area.",
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
      id: "loadFactorPercent",
      kind: "number",
      label: "Load Factor Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateLoadFactor({
      rentableSquareFeet: input.rentableSquareFeet as number,
      usableSquareFeet: input.usableSquareFeet as number,
    }),
});
export const loadFactorTool = tool;
export const runLoadFactor = tool.execute;
export default tool;
