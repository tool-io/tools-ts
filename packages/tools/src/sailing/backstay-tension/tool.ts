import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type BackstayTensionInput = {
  apparentWindKt: number;
};

export type BackstayTensionOutput = {
  backstayPercent: number;
};

export const backstayTensionExample = {
  input: { apparentWindKt: 15 },
  output: { backstayPercent: 60 },
} satisfies ToolExample<BackstayTensionInput, BackstayTensionOutput>;

export const backstayTensionTool = createSimpleTool({
  calculate: (input) => ({
    backstayPercent: Math.min(
      100,
      Math.max(10, Math.round((input.apparentWindKt as number) * 4)),
    ),
  }),
  description:
    "Suggest backstay tension from backstayPercent = min(100, max(10, round(apparentWindKt * 4))).",
  id: "sailing/backstay-tension",
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
      description: "Recommended backstay tension as a percentage of range.",
      id: "backstayPercent",
      kind: "number",
      label: "Backstay tension",
      unit: "%",
    },
  ],
  title: "Backstay Tension Guide",
});
export const runBackstayTension = backstayTensionTool.execute;
export default backstayTensionTool;
