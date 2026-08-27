import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const ultrasoundBackfatExample = {
  input: { backfatMm: 10 },
} satisfies ToolExample<{
  readonly backfatMm: number;
}>;

export const ultrasoundBackfatTool = createSimpleTool({
  id: "biology/ultrasound-backfat",
  title: "Backfat Class Lookup",
  description:
    "Classify an ultrasound backfat measurement in millimetres as lean, optimal, or over-finished.",
  inputs: [
    {
      id: "backfatMm",
      label: "Backfat mm",
      kind: "number",
      maximum: 30,
      minimum: 0,
    },
  ],
  outputs: [{ id: "finishClass", label: "Finish class", kind: "string" }],
  calculate: (input) => {
    const backfatMm = input.backfatMm as number;
    return {
      finishClass:
        backfatMm < 6 ? "lean" : backfatMm <= 15 ? "optimal" : "over-finished",
    };
  },
});
export const runUltrasoundBackfat = ultrasoundBackfatTool.execute;
export default ultrasoundBackfatTool;
