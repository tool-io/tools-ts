import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StairRiserHeightInput = Readonly<{
  readonly totalRiseM: number;
  readonly riserCount: number;
}>;
export type StairRiserHeightOutput = Readonly<{
  readonly riserHeightM: number;
}>;

export const calculateStairRiserHeight = (
  x: StairRiserHeightInput,
): StairRiserHeightOutput => {
  if (!Number.isFinite(x.totalRiseM) || x.totalRiseM < 0)
    simpleError("totalRiseM", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.riserCount) || x.riserCount < 1)
    simpleError("riserCount", "Provide a safe integer at least 1.");
  if (!(x.riserCount > 0))
    simpleError("riserCount", "Riser count must be positive.");
  const riserHeightM = x.totalRiseM / x.riserCount;
  if (!Number.isFinite(riserHeightM))
    simpleError("riserHeightM", "The inputs produce an invalid result.");
  return { riserHeightM: Object.is(riserHeightM, -0) ? 0 : riserHeightM };
};

export const example = {
  input: { totalRiseM: 2.8, riserCount: 16 },
  output: { riserHeightM: 0.175 },
} satisfies ToolExample<StairRiserHeightInput, StairRiserHeightOutput>;

export const tool = createSimpleTool({
  id: "construction/stair-riser-height",
  title: "Stair Riser Height",
  description:
    "Divide total vertical rise by the number of equal risers; check local stair-code bounds separately.",
  inputs: [
    {
      id: "totalRiseM",
      kind: "number",
      label: "Total vertical rise",
      unit: "m",
      minimum: 0,
    },
    {
      id: "riserCount",
      kind: "integer",
      label: "Number of risers",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "riserHeightM",
      kind: "number",
      label: "Equal riser height",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateStairRiserHeight({
      totalRiseM: input.totalRiseM as number,
      riserCount: input.riserCount as number,
    }),
});
export const stairRiserHeightTool = tool;
export const runStairRiserHeight = tool.execute;
export default tool;
