import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type OuthaulTensionInput = {
  apparentWindKt: number;
};

export type OuthaulTensionOutput = {
  outhaulPercent: number;
};

export const outhaulTensionExample = {
  input: { apparentWindKt: 10 },
  output: { outhaulPercent: 60 },
} satisfies ToolExample<OuthaulTensionInput, OuthaulTensionOutput>;

export const outhaulTensionTool = createSimpleTool({
  calculate: (input) => ({
    outhaulPercent: Math.min(
      100,
      Math.max(20, 20 + Math.round((input.apparentWindKt as number) * 4)),
    ),
  }),
  description:
    "Suggest increasing outhaul tension as apparent wind rises, from twenty percent in very light air to full tension at twenty knots.",
  id: "sailing/outhaul-tension",
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
      description: "Recommended outhaul tension as a percentage of range.",
      id: "outhaulPercent",
      kind: "number",
      label: "Outhaul tension",
      unit: "%",
    },
  ],
  title: "Outhaul Tension Guide",
});
export const runOuthaulTension = outhaulTensionTool.execute;
export default outhaulTensionTool;
