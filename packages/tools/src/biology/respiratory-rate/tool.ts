import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const respiratoryRateExample = {
  input: { breathsPerMin: 16 },
  output: { breathsPerMinute: 16, normalRange: true },
} satisfies ToolExample<
  { readonly breathsPerMin: number },
  { readonly breathsPerMinute: number; readonly normalRange: boolean }
>;

export const respiratoryRateTool = createSimpleTool({
  id: "biology/respiratory-rate",
  title: "Respiratory Rate Check",
  description:
    "Check whether a respiratory rate in breaths per minute falls within the normal adult range of 12 to 20 inclusive.",
  inputs: [
    {
      id: "breathsPerMin",
      kind: "number",
      label: "Breaths per minute",
      maximum: 60,
      minimum: 6,
      unit: "breaths/min",
    },
  ],
  outputs: [
    {
      description: "True when the rate is within 12 to 20 inclusive.",
      id: "normalRange",
      kind: "boolean",
      label: "Within normal range",
    },
    {
      id: "breathsPerMinute",
      kind: "number",
      label: "Breaths per minute",
      unit: "breaths/min",
    },
  ],
  calculate: (input) => {
    const breathsPerMinute = input.breathsPerMin as number;
    return {
      breathsPerMinute,
      normalRange: breathsPerMinute >= 12 && breathsPerMinute <= 20,
    };
  },
});
export const runRespiratoryRate = respiratoryRateTool.execute;
export default respiratoryRateTool;
