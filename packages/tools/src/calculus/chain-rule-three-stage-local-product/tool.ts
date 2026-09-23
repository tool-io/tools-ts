import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerDerivative: number;
  readonly middleDerivative: number;
  readonly innerDerivative: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerDerivative: { type: "number" },
    middleDerivative: { type: "number" },
    innerDerivative: { type: "number" },
  },
  required: ["outerDerivative", "middleDerivative", "innerDerivative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate chain rule three stage local product from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerDerivative, middleDerivative, innerDerivative } = request;
  const compute = (): Output => {
    return { derivative: outerDerivative * middleDerivative * innerDerivative };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outerDerivative: 2, middleDerivative: -3, innerDerivative: 4 },
  output: { derivative: -24 },
} satisfies ToolExample<Input, Output>;
export const chainRuleThreeStageLocalProductTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/chain-rule-three-stage-local-product",
    title: "Chain Rule Three Stage Local Product Tool",
    description:
      "Calculate chain rule three stage local product from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerDerivative: { type: "number" },
        middleDerivative: { type: "number" },
        innerDerivative: { type: "number" },
      },
      required: ["outerDerivative", "middleDerivative", "innerDerivative"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { derivative: { type: "number" } },
      required: ["derivative"],
    },
    ports: {
      inputs: [
        {
          id: "outerDerivative",
          label: "Outer Derivative",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "middleDerivative",
          label: "Middle Derivative",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "innerDerivative",
          label: "Inner Derivative",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = chainRuleThreeStageLocalProductTool.execute;
export default chainRuleThreeStageLocalProductTool;
