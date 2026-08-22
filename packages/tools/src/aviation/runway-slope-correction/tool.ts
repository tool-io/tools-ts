import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RunwaySlopeCorrectionInput = {
  readonly baseDistanceFt: number;
  readonly slopePercent: number;
};

export type RunwaySlopeCorrectionOutput = {
  readonly correctedDistanceFt: number;
};

export const runwaySlopeCorrectionExample = {
  input: { baseDistanceFt: 2000, slopePercent: 1 },
  output: { correctedDistanceFt: 2200 },
} satisfies ToolExample<
  RunwaySlopeCorrectionInput,
  RunwaySlopeCorrectionOutput
>;

export const calculateRunwaySlopeCorrection = (
  input: RunwaySlopeCorrectionInput,
): RunwaySlopeCorrectionOutput => ({
  correctedDistanceFt: Math.round(
    input.baseDistanceFt * (1 + (input.slopePercent / 100) * 10),
  ),
});

export const runwaySlopeCorrectionTool = createSimpleTool({
  calculate: (input) =>
    calculateRunwaySlopeCorrection(
      input as unknown as RunwaySlopeCorrectionInput,
    ),
  description:
    "Adjust a published takeoff or landing distance for a runway slope; positive slope is uphill.",
  id: "aviation/runway-slope-correction",
  inputs: [
    {
      description: "Published no-slope ground distance.",
      id: "baseDistanceFt",
      kind: "number",
      label: "Base distance",
      unit: "ft",
    },
    {
      description:
        "Runway gradient in percent; positive is uphill, negative is downhill.",
      id: "slopePercent",
      kind: "number",
      label: "Slope",
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Slope-corrected distance.",
      format: "length-ft",
      id: "correctedDistanceFt",
      kind: "number",
      label: "Corrected distance",
      unit: "ft",
    },
  ],
  title: "Runway Slope Correction Calculator",
});
export const runRunwaySlopeCorrection = runwaySlopeCorrectionTool.execute;
export default runwaySlopeCorrectionTool;
