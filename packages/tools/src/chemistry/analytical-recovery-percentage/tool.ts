import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { unspikedResult: 10, spikedResult: 19, addedAmount: 10 },
  output: { recoveryPercent: 90 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/analytical-recovery-percentage",
  title: "Analytical Spike Recovery",
  description:
    "Calculate percent recovery as (measured spiked result − unspiked result)/known spike amount ×100. All three quantities must use the same unit; values outside 0–100% can reveal matrix effects or measurement problems.",
  inputs: [
    { id: "unspikedResult", kind: "number", label: "Unspiked measured amount" },
    { id: "spikedResult", kind: "number", label: "Spiked measured amount" },
    {
      id: "addedAmount",
      kind: "number",
      label: "Known added amount",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "recoveryPercent", kind: "number", label: "Recovery Percent" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      recoveryPercent:
        ((i.spikedResult - i.unspikedResult) / i.addedAmount) * 100,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type AnalyticalRecoveryPercentageInput = Readonly<typeof example.input>;
export type AnalyticalRecoveryPercentageOutput = Readonly<
  typeof example.output
>;
export const analyticalRecoveryPercentageTool = tool;
export const runAnalyticalRecoveryPercentage = tool.execute;
export default tool;
