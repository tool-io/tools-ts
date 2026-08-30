import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FloorAreaRatioInput = Readonly<{
  readonly grossFloorAreaSquareFeet: number;
  readonly landAreaSquareFeet: number;
}>;
export type FloorAreaRatioOutput = Readonly<{
  readonly floorAreaRatio: number;
}>;

export const calculateFloorAreaRatio = (
  x: FloorAreaRatioInput,
): FloorAreaRatioOutput => {
  if (
    !Number.isFinite(x.grossFloorAreaSquareFeet) ||
    x.grossFloorAreaSquareFeet < 0
  )
    simpleError(
      "grossFloorAreaSquareFeet",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.landAreaSquareFeet) || x.landAreaSquareFeet <= 0)
    simpleError("landAreaSquareFeet", "Provide a finite positive number.");
  const floorAreaRatio = x.grossFloorAreaSquareFeet / x.landAreaSquareFeet;
  if (!Number.isFinite(floorAreaRatio))
    simpleError(
      "floorAreaRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { floorAreaRatio: Object.is(floorAreaRatio, -0) ? 0 : floorAreaRatio };
};

export const example = {
  input: {
    grossFloorAreaSquareFeet: 20000,
    landAreaSquareFeet: 10000,
  },
  output: { floorAreaRatio: 2 },
} satisfies ToolExample<FloorAreaRatioInput, FloorAreaRatioOutput>;

export const tool = createSimpleTool({
  id: "real-estate/floor-area-ratio",
  title: "Floor Area Ratio",
  description:
    "Total gross floor area divided by land area, using matching area units.",
  inputs: [
    {
      id: "grossFloorAreaSquareFeet",
      kind: "number",
      label: "Gross Floor Area Square Feet",
      unit: "ft2",
      minimum: 0,
    },
    {
      id: "landAreaSquareFeet",
      kind: "number",
      label: "Land Area Square Feet",
      unit: "ft2",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "floorAreaRatio", kind: "number", label: "Floor Area Ratio" },
  ],
  calculate: (input) =>
    calculateFloorAreaRatio({
      grossFloorAreaSquareFeet: input.grossFloorAreaSquareFeet as number,
      landAreaSquareFeet: input.landAreaSquareFeet as number,
    }),
});
export const floorAreaRatioTool = tool;
export const runFloorAreaRatio = tool.execute;
export default tool;
