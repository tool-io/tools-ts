import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CunninghamTensionInput = {
  apparentWindKt: number;
};

export type CunninghamTensionOutput = {
  cunninghamPercent: number;
};

export const cunninghamTensionExample = {
  input: { apparentWindKt: 18 },
  output: { cunninghamPercent: 60 },
} satisfies ToolExample<CunninghamTensionInput, CunninghamTensionOutput>;

export const cunninghamTensionTool = createSimpleTool({
  calculate: (input) => ({
    cunninghamPercent: Math.min(
      100,
      Math.max(0, Math.round(((input.apparentWindKt as number) - 8) * 6)),
    ),
  }),
  description:
    "Suggest cunningham tension from cunninghamPercent = min(100, max(0, round((apparentWindKt - 8) * 6))).",
  id: "sailing/cunningham-tension",
  inputs: [
    {
      description: "Apparent wind speed.",
      id: "apparentWindKt",
      kind: "number",
      label: "Apparent wind",
      minimum: 0,
      unit: "kn",
    },
  ],
  outputs: [
    {
      description: "Recommended cunningham tension as a percentage of range.",
      id: "cunninghamPercent",
      kind: "number",
      label: "Cunningham tension",
      unit: "%",
    },
  ],
  title: "Cunningham Tension Guide",
});
export const runCunninghamTension = cunninghamTensionTool.execute;
export default cunninghamTensionTool;
