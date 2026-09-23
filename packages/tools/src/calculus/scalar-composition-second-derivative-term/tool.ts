import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly outerFirst: number;
  readonly outerSecond: number;
  readonly innerFirst: number;
  readonly innerSecond: number;
};
export type Output = {
  readonly curvatureTerm: number;
  readonly accelerationTerm: number;
  readonly secondDerivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerFirst: { type: "number" },
    outerSecond: { type: "number" },
    innerFirst: { type: "number" },
    innerSecond: { type: "number" },
  },
  required: ["outerFirst", "outerSecond", "innerFirst", "innerSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    curvatureTerm: { type: "number" },
    accelerationTerm: { type: "number" },
    secondDerivative: { type: "number" },
  },
  required: ["curvatureTerm", "accelerationTerm", "secondDerivative"],
} as const;
/** Compute scalar composition second derivative term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { outerFirst, outerSecond, innerFirst, innerSecond } = input;
  const compute = (): Output => {
    const curvatureTerm = outerSecond * innerFirst ** 2,
      accelerationTerm = outerFirst * innerSecond;
    return {
      curvatureTerm,
      accelerationTerm,
      secondDerivative: curvatureTerm + accelerationTerm,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { outerFirst: 2, outerSecond: 3, innerFirst: 4, innerSecond: 5 },
  output: { curvatureTerm: 48, accelerationTerm: 10, secondDerivative: 58 },
} satisfies ToolExample<Input, Output>;
export const scalarCompositionSecondDerivativeTermTool =
  defineSchemaCalculation<Input, Output>({
    id: "calculus/scalar-composition-second-derivative-term",
    title: "Scalar Composition Second Derivative Term Tool",
    description:
      "Compute scalar composition second derivative term from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "outerFirst",
          label: "Outer First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outerSecond",
          label: "Outer Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "innerFirst",
          label: "Inner First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "innerSecond",
          label: "Inner Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "curvatureTerm",
          label: "Curvature Term",
          valueType: { type: "number" },
        },
        {
          id: "accelerationTerm",
          label: "Acceleration Term",
          valueType: { type: "number" },
        },
        {
          id: "secondDerivative",
          label: "Second Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  });
export const run = scalarCompositionSecondDerivativeTermTool.execute;
export default scalarCompositionSecondDerivativeTermTool;
