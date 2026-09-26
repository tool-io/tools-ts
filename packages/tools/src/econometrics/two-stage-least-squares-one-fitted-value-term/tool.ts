import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly instruments: readonly number[];
  readonly firstStageCoefficients: readonly number[];
  readonly intercept: number;
};
export type Output = { readonly fittedEndogenous: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    instruments: { type: "array", maxItems: 256, items: { type: "number" } },
    firstStageCoefficients: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    intercept: { type: "number" },
  },
  required: ["instruments", "firstStageCoefficients", "intercept"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fittedEndogenous: { type: "number" } },
  required: ["fittedEndogenous"],
} as const;
/** Evaluate one supplied first-stage fitted value; this does not estimate coefficients or establish instrument validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { instruments, firstStageCoefficients, intercept } = request;
  const compute = (): Output => {
    H.sameLength(instruments, firstStageCoefficients);
    return {
      fittedEndogenous: intercept + H.dot(instruments, firstStageCoefficients),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    instruments: [2, 3],
    firstStageCoefficients: [0.5, 2],
    intercept: 1,
  },
  output: { fittedEndogenous: 8 },
} satisfies ToolExample<Input, Output>;
export const twoStageLeastSquaresOneFittedValueTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "econometrics/two-stage-least-squares-one-fitted-value-term",
      title: "Two Stage Least Squares One Fitted Value Term Tool",
      description:
        "Evaluate one supplied first-stage fitted value; this does not estimate coefficients or establish instrument validity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          instruments: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          firstStageCoefficients: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          intercept: { type: "number" },
        },
        required: ["instruments", "firstStageCoefficients", "intercept"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { fittedEndogenous: { type: "number" } },
        required: ["fittedEndogenous"],
      },
      ports: {
        inputs: [
          {
            id: "instruments",
            label: "Instruments",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "firstStageCoefficients",
            label: "First Stage Coefficients",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "intercept",
            label: "Intercept",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "fittedEndogenous",
            label: "Fitted Endogenous",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = twoStageLeastSquaresOneFittedValueTermTool.execute;
export default twoStageLeastSquaresOneFittedValueTermTool;
