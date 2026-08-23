import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type RunwayWindTotalInput = {
  readonly crosswindKt: number;
  readonly headwindKt: number;
};

export type RunwayWindTotalOutput = {
  readonly totalComponentKt: number;
};

export const runwayWindTotalExample = {
  input: { crosswindKt: 40, headwindKt: 30 },
  output: { totalComponentKt: 50 },
} satisfies ToolExample<RunwayWindTotalInput, RunwayWindTotalOutput>;

export const calculateRunwayWindTotal = (
  input: RunwayWindTotalInput,
): RunwayWindTotalOutput => ({
  totalComponentKt: Math.hypot(input.headwindKt, input.crosswindKt),
});

export const runwayWindTotalTool = createSimpleTool({
  id: "aviation/runway-wind-total",
  title: "Total Wind Component Calculator",
  description:
    "Combine signed headwind and crosswind components into the total wind magnitude.",
  inputs: [
    {
      description: "Signed crosswind component.",
      id: "crosswindKt",
      label: "Crosswind component",
      kind: "number",
      unit: "kt",
    },
    {
      description: "Signed headwind component; negative means tailwind.",
      id: "headwindKt",
      label: "Headwind component",
      kind: "number",
      unit: "kt",
    },
  ],
  outputs: [
    {
      id: "totalComponentKt",
      label: "Total wind component",
      kind: "number",
      unit: "kt",
    },
  ],
  calculate: (input) =>
    calculateRunwayWindTotal({
      crosswindKt: input.crosswindKt as number,
      headwindKt: input.headwindKt as number,
    }),
});
export const runRunwayWindTotal = runwayWindTotalTool.execute;
export default runwayWindTotalTool;
