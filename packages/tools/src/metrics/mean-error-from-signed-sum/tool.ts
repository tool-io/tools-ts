import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signedErrorSum: number;
  readonly observationCount: number;
};
export type Output = { readonly meanError: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedErrorSum: { type: "number" },
    observationCount: { type: "integer", minimum: 1 },
  },
  required: ["signedErrorSum", "observationCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { meanError: { type: "number" } },
  required: ["meanError"],
} as const;
/** Recover mean signed prediction error from an explicitly supplied signed error sum and observation count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedErrorSum, observationCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(observationCount) &&
        observationCount >= 1 &&
        observationCount <= Number.MAX_SAFE_INTEGER,
      "observationCount",
    ),
      observationCount);
    return { meanError: signedErrorSum / observationCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signedErrorSum: 15, observationCount: 6 },
  output: { meanError: 2.5 },
} satisfies ToolExample<Input, Output>;
export const meanErrorFromSignedSumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/mean-error-from-signed-sum",
    title: "Mean Error From Signed Sum Tool",
    description:
      "Recover mean signed prediction error from an explicitly supplied signed error sum and observation count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedErrorSum: { type: "number" },
        observationCount: { type: "integer", minimum: 1 },
      },
      required: ["signedErrorSum", "observationCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { meanError: { type: "number" } },
      required: ["meanError"],
    },
    ports: {
      inputs: [
        {
          id: "signedErrorSum",
          label: "Signed Error Sum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observationCount",
          label: "Observation Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "meanError", label: "Mean Error", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = meanErrorFromSignedSumTool.execute;
export default meanErrorFromSignedSumTool;
