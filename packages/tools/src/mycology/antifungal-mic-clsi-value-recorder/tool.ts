import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MicValueRecorderInput = {
  readonly micMgPerL: number;
};

export type MicValueRecorderOutput = {
  readonly interpretation: "not-interpreted";
  readonly micValueMgPerL: number;
};

export const micValueRecorderExample = {
  input: { micMgPerL: 1 },
  output: { interpretation: "not-interpreted", micValueMgPerL: 1 },
} satisfies ToolExample<MicValueRecorderInput, MicValueRecorderOutput>;

export const calculateMicValueRecorder = (
  input: MicValueRecorderInput,
): MicValueRecorderOutput => {
  if (!Number.isFinite(input.micMgPerL) || input.micMgPerL < 0)
    return simpleError(
      "micMgPerL",
      "MIC must be finite and non-negative.",
      "invalid_mic",
    );
  return { interpretation: "not-interpreted", micValueMgPerL: input.micMgPerL };
};

export const micValueRecorderTool = createSimpleTool({
  id: "mycology/antifungal-mic-clsi-value-recorder",
  title: "Antifungal MIC Value Recorder",
  description:
    "Record an antifungal minimum inhibitory concentration without inventing a universal low, moderate, or high tier. Clinical interpretation requires current organism-, drug-, and method-specific CLSI breakpoints or epidemiological cutoff values.",
  inputs: [{ id: "micMgPerL", kind: "number", label: "MIC", minimum: 0 }],
  outputs: [
    { id: "micValueMgPerL", kind: "number", label: "MIC value", unit: "mg/L" },
    {
      enum: ["not-interpreted"],
      id: "interpretation",
      kind: "string",
      label: "Interpretation",
    },
  ],
  calculate: (input) =>
    calculateMicValueRecorder({ micMgPerL: input.micMgPerL as number }),
});
export const runMicValueRecorder = micValueRecorderTool.execute;
export default micValueRecorderTool;
