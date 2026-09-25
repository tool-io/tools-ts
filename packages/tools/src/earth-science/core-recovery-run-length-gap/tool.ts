import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly runLength: number;
  readonly recoveredLength: number;
  readonly fragmentedUnmeasuredLength: number;
};
export type Output = {
  readonly measuredRecovery: number;
  readonly possibleRecovery: number;
  readonly missingLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    runLength: { type: "number", exclusiveMinimum: 0 },
    recoveredLength: { type: "number", minimum: 0 },
    fragmentedUnmeasuredLength: { type: "number", minimum: 0 },
  },
  required: ["runLength", "recoveredLength", "fragmentedUnmeasuredLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredRecovery: { type: "number" },
    possibleRecovery: { type: "number" },
    missingLength: { type: "number" },
  },
  required: ["measuredRecovery", "possibleRecovery", "missingLength"],
} as const;
/** Separate measured and caller-estimated possible recovered length fractions, not rock quality designation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { runLength, recoveredLength, fragmentedUnmeasuredLength } = request;
  const compute = (): Output => {
    H.positive(runLength);
    H.domain(
      recoveredLength >= 0 &&
        fragmentedUnmeasuredLength >= 0 &&
        recoveredLength + fragmentedUnmeasuredLength <= runLength,
    );
    return {
      measuredRecovery: recoveredLength / runLength,
      possibleRecovery:
        (recoveredLength + fragmentedUnmeasuredLength) / runLength,
      missingLength: runLength - recoveredLength - fragmentedUnmeasuredLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { runLength: 10, recoveredLength: 8, fragmentedUnmeasuredLength: 1 },
  output: { measuredRecovery: 0.8, possibleRecovery: 0.9, missingLength: 1 },
} satisfies ToolExample<Input, Output>;
export const coreRecoveryRunLengthGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/core-recovery-run-length-gap",
    title: "Core Recovery Run Length Gap Tool",
    description:
      "Separate measured and caller-estimated possible recovered length fractions, not rock quality designation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        runLength: { type: "number", exclusiveMinimum: 0 },
        recoveredLength: { type: "number", minimum: 0 },
        fragmentedUnmeasuredLength: { type: "number", minimum: 0 },
      },
      required: ["runLength", "recoveredLength", "fragmentedUnmeasuredLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredRecovery: { type: "number" },
        possibleRecovery: { type: "number" },
        missingLength: { type: "number" },
      },
      required: ["measuredRecovery", "possibleRecovery", "missingLength"],
    },
    ports: {
      inputs: [
        {
          id: "runLength",
          label: "Run Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recoveredLength",
          label: "Recovered Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fragmentedUnmeasuredLength",
          label: "Fragmented Unmeasured Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "measuredRecovery",
          label: "Measured Recovery",
          valueType: { type: "number" },
        },
        {
          id: "possibleRecovery",
          label: "Possible Recovery",
          valueType: { type: "number" },
        },
        {
          id: "missingLength",
          label: "Missing Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = coreRecoveryRunLengthGapTool.execute;
export default coreRecoveryRunLengthGapTool;
