import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UsableAreaInput = Readonly<{
  readonly rentableSquareFeet: number;
  readonly loadFactorPercent: number;
}>;
export type UsableAreaOutput = Readonly<{
  readonly usableSquareFeet: number;
}>;

export const calculateUsableArea = (x: UsableAreaInput): UsableAreaOutput => {
  if (!Number.isFinite(x.rentableSquareFeet) || x.rentableSquareFeet < 0)
    simpleError("rentableSquareFeet", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.loadFactorPercent) || x.loadFactorPercent < 0)
    simpleError("loadFactorPercent", "Provide a finite nonnegative number.");
  const usableSquareFeet =
    x.rentableSquareFeet / (1 + x.loadFactorPercent / 100);
  if (!Number.isFinite(usableSquareFeet))
    simpleError(
      "usableSquareFeet",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    usableSquareFeet: Object.is(usableSquareFeet, -0) ? 0 : usableSquareFeet,
  };
};

export const example = {
  input: {
    rentableSquareFeet: 11000,
    loadFactorPercent: 10,
  },
  output: { usableSquareFeet: 10000 },
} satisfies ToolExample<UsableAreaInput, UsableAreaOutput>;

export const tool = createSimpleTool({
  id: "real-estate/usable-area",
  title: "Usable Area",
  description:
    "Usable floor area from rentable area and a load factor measured relative to usable area.",
  inputs: [
    {
      id: "rentableSquareFeet",
      kind: "number",
      label: "Rentable Square Feet",
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
      id: "usableSquareFeet",
      kind: "number",
      label: "Usable Square Feet",
      unit: "ft2",
    },
  ],
  calculate: (input) =>
    calculateUsableArea({
      rentableSquareFeet: input.rentableSquareFeet as number,
      loadFactorPercent: input.loadFactorPercent as number,
    }),
});
export const usableAreaTool = tool;
export const runUsableArea = tool.execute;
export default tool;
