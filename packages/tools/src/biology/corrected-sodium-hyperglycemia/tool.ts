import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CorrectedSodiumInput = {
  readonly glucoseMgDl: number;
  readonly measuredNaMmolL: number;
};

export type CorrectedSodiumOutput = {
  readonly correctedSodiumMmolL: number;
};

export const correctedSodiumExample = {
  input: { measuredNaMmolL: 140, glucoseMgDl: 500 },
  output: { correctedSodiumMmolL: 146.4 },
} satisfies ToolExample<CorrectedSodiumInput, CorrectedSodiumOutput>;

export const correctedSodiumTool = createSimpleTool({
  id: "biology/corrected-sodium-hyperglycemia",
  title: "Corrected Sodium",
  description:
    "Correct measured serum sodium for hyperglycemia with the 1.6 per 100 mg/dL rule.",
  inputs: [
    {
      id: "glucoseMgDl",
      kind: "number",
      label: "Glucose",
      minimum: 0,
      unit: "mg/dL",
    },
    {
      id: "measuredNaMmolL",
      kind: "number",
      label: "Measured sodium",
      minimum: 0,
      unit: "mmol/L",
    },
  ],
  outputs: [
    {
      id: "correctedSodiumMmolL",
      kind: "number",
      label: "Corrected sodium",
      unit: "mmol/L",
    },
  ],
  calculate: (input) => ({
    correctedSodiumMmolL:
      (input.measuredNaMmolL as number) +
      (1.6 * Math.max(0, (input.glucoseMgDl as number) - 100)) / 100,
  }),
});
export const runCorrectedSodium = correctedSodiumTool.execute;
export default correctedSodiumTool;
