import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baselineElapsedMinutes: number;
  readonly sampleElapsedMinutes: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineElapsedMinutes: { type: "number" },
    sampleElapsedMinutes: { type: "number" },
  },
  required: ["baselineElapsedMinutes", "sampleElapsedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied endocrine sample time relative to explicit baseline elapsed minutes without selecting a test protocol. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baselineElapsedMinutes, sampleElapsedMinutes } = request;
  const compute = (): Output => {
    return { signedGap: sampleElapsedMinutes - baselineElapsedMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baselineElapsedMinutes: 12, sampleElapsedMinutes: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const endocrineTestBaselineTimeReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/endocrine-test-baseline-time-reference",
    title: "Endocrine Test Baseline Time Reference Tool",
    description:
      "Calculate supplied endocrine sample time relative to explicit baseline elapsed minutes without selecting a test protocol.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselineElapsedMinutes: { type: "number" },
        sampleElapsedMinutes: { type: "number" },
      },
      required: ["baselineElapsedMinutes", "sampleElapsedMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "baselineElapsedMinutes",
          label: "Baseline Elapsed Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleElapsedMinutes",
          label: "Sample Elapsed Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = endocrineTestBaselineTimeReferenceTool.execute;
export default endocrineTestBaselineTimeReferenceTool;
