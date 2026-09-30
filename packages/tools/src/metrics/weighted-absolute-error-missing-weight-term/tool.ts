import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly error: number;
  readonly weight: number;
  readonly present: boolean;
};
export type Output = {
  readonly numerator: number;
  readonly denominator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    error: { type: "number", minimum: 0 },
    weight: { type: "number", minimum: 0 },
    present: { type: "boolean" },
  },
  required: ["error", "weight", "present"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "number" },
    denominator: { type: "number" },
  },
  required: ["numerator", "denominator"],
} as const;
/** Calculate weighted absolute error missing weight term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { error, weight, present } = request;
  const compute = (): Output => {
    H.domain(error >= 0 && weight >= 0);
    return {
      numerator: present ? error * weight : 0,
      denominator: present ? weight : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { error: 3, weight: 2, present: true },
  output: { numerator: 6, denominator: 2 },
} satisfies ToolExample<Input, Output>;
export const weightedAbsoluteErrorMissingWeightTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "metrics/weighted-absolute-error-missing-weight-term",
      title: "Weighted Absolute Error Missing Weight Term Tool",
      description:
        "Calculate weighted absolute error missing weight term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          error: { type: "number", minimum: 0 },
          weight: { type: "number", minimum: 0 },
          present: { type: "boolean" },
        },
        required: ["error", "weight", "present"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          numerator: { type: "number" },
          denominator: { type: "number" },
        },
        required: ["numerator", "denominator"],
      },
      ports: {
        inputs: [
          {
            id: "error",
            label: "Error",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "weight",
            label: "Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "present",
            label: "Present",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "numerator",
            label: "Numerator",
            valueType: { type: "number" },
          },
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = weightedAbsoluteErrorMissingWeightTermTool.execute;
export default weightedAbsoluteErrorMissingWeightTermTool;
