import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly errors: number; readonly classTotal: number };
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    errors: { type: "integer", minimum: 0 },
    classTotal: { type: "integer", minimum: 1 },
  },
  required: ["errors", "classTotal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Calculate binary balanced error contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { errors, classTotal } = request;
  const compute = (): Output => {
    H.integer(classTotal, 1);
    H.integer(errors, 0, classTotal);
    return { contribution: (0.5 * errors) / classTotal };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { errors: 10, classTotal: 50 },
  output: { contribution: 0.1 },
} satisfies ToolExample<Input, Output>;
export const binaryBalancedErrorContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/binary-balanced-error-contribution",
    title: "Binary Balanced Error Contribution Tool",
    description:
      "Calculate binary balanced error contribution from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        errors: { type: "integer", minimum: 0 },
        classTotal: { type: "integer", minimum: 1 },
      },
      required: ["errors", "classTotal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "errors",
          label: "Errors",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "classTotal",
          label: "Class Total",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = binaryBalancedErrorContributionTool.execute;
export default binaryBalancedErrorContributionTool;
