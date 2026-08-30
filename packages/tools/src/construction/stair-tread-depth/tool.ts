import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StairTreadDepthInput = Readonly<{
  readonly totalRunM: number;
  readonly treadCount: number;
}>;
export type StairTreadDepthOutput = Readonly<{
  readonly treadDepthM: number;
}>;

export const calculateStairTreadDepth = (
  x: StairTreadDepthInput,
): StairTreadDepthOutput => {
  if (!Number.isFinite(x.totalRunM) || x.totalRunM < 0)
    simpleError("totalRunM", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.treadCount) || x.treadCount < 1)
    simpleError("treadCount", "Provide a safe integer at least 1.");
  if (!(x.treadCount > 0))
    simpleError("treadCount", "Tread count must be positive.");
  const treadDepthM = x.totalRunM / x.treadCount;
  if (!Number.isFinite(treadDepthM))
    simpleError("treadDepthM", "The inputs produce an invalid result.");
  return { treadDepthM: Object.is(treadDepthM, -0) ? 0 : treadDepthM };
};

export const example = {
  input: { totalRunM: 3, treadCount: 10 },
  output: { treadDepthM: 0.3 },
} satisfies ToolExample<StairTreadDepthInput, StairTreadDepthOutput>;

export const tool = createSimpleTool({
  id: "construction/stair-tread-depth",
  title: "Stair Tread Depth",
  description:
    "Divide total horizontal stair run by the number of equal treads; excludes nosing projections and landings.",
  inputs: [
    {
      id: "totalRunM",
      kind: "number",
      label: "Total horizontal run",
      unit: "m",
      minimum: 0,
    },
    {
      id: "treadCount",
      kind: "integer",
      label: "Number of treads",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "treadDepthM",
      kind: "number",
      label: "Equal tread depth",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateStairTreadDepth({
      totalRunM: input.totalRunM as number,
      treadCount: input.treadCount as number,
    }),
});
export const stairTreadDepthTool = tool;
export const runStairTreadDepth = tool.execute;
export default tool;
