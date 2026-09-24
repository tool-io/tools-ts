import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly accepted: number; readonly errors: number };
export type Output = { readonly risk: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accepted: { type: "integer", minimum: 1 },
    errors: { type: "integer", minimum: 0 },
  },
  required: ["accepted", "errors"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { risk: { type: "number" } },
  required: ["risk"],
} as const;
/** Calculate selective risk from accepted errors from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { accepted, errors } = request;
  const compute = (): Output => {
    H.integer(accepted, 1);
    H.integer(errors, 0, accepted);
    return { risk: errors / accepted };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { accepted: 80, errors: 8 },
  output: { risk: 0.1 },
} satisfies ToolExample<Input, Output>;
export const selectiveRiskFromAcceptedErrorsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/selective-risk-from-accepted-errors",
    title: "Selective Risk From Accepted Errors Tool",
    description:
      "Calculate selective risk from accepted errors from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accepted: { type: "integer", minimum: 1 },
        errors: { type: "integer", minimum: 0 },
      },
      required: ["accepted", "errors"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { risk: { type: "number" } },
      required: ["risk"],
    },
    ports: {
      inputs: [
        {
          id: "accepted",
          label: "Accepted",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "errors",
          label: "Errors",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "risk", label: "Risk", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = selectiveRiskFromAcceptedErrorsTool.execute;
export default selectiveRiskFromAcceptedErrorsTool;
