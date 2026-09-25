import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recoveredLength: number;
  readonly runLength: number;
  readonly excludedRecoveredLength: number;
};
export type Output = { readonly countedLength: number; readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recoveredLength: { type: "number", minimum: 0 },
    runLength: { type: "number", exclusiveMinimum: 0 },
    excludedRecoveredLength: { type: "number", minimum: 0 },
  },
  required: ["recoveredLength", "runLength", "excludedRecoveredLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { countedLength: { type: "number" }, ratio: { type: "number" } },
  required: ["countedLength", "ratio"],
} as const;
/** Compare supplied recovery/run lengths, preserving ratios above one rather than clipping possible expansion or accounting discrepancies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recoveredLength, runLength, excludedRecoveredLength } = request;
  const compute = (): Output => {
    H.positive(runLength);
    H.domain(
      recoveredLength >= 0 &&
        excludedRecoveredLength >= 0 &&
        excludedRecoveredLength <= recoveredLength,
    );
    return {
      countedLength: recoveredLength - excludedRecoveredLength,
      ratio: (recoveredLength - excludedRecoveredLength) / runLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recoveredLength: 12, runLength: 10, excludedRecoveredLength: 1 },
  output: { countedLength: 11, ratio: 1.1 },
} satisfies ToolExample<Input, Output>;
export const coreRecoveryLengthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/core-recovery-length-ratio",
    title: "Core Recovery Length Ratio Tool",
    description:
      "Compare supplied recovery/run lengths, preserving ratios above one rather than clipping possible expansion or accounting discrepancies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recoveredLength: { type: "number", minimum: 0 },
        runLength: { type: "number", exclusiveMinimum: 0 },
        excludedRecoveredLength: { type: "number", minimum: 0 },
      },
      required: ["recoveredLength", "runLength", "excludedRecoveredLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedLength: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["countedLength", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "recoveredLength",
          label: "Recovered Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "runLength",
          label: "Run Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedRecoveredLength",
          label: "Excluded Recovered Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "countedLength",
          label: "Counted Length",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = coreRecoveryLengthRatioTool.execute;
export default coreRecoveryLengthRatioTool;
