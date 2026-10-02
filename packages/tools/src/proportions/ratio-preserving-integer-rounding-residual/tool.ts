import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numerator: number;
  readonly denominator: number;
  readonly roundedNumerator: number;
  readonly roundedDenominator: number;
};
export type Output = { readonly crossResidual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "number" },
    denominator: { type: "number" },
    roundedNumerator: { type: "integer" },
    roundedDenominator: { type: "integer" },
  },
  required: [
    "numerator",
    "denominator",
    "roundedNumerator",
    "roundedDenominator",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { crossResidual: { type: "number" } },
  required: ["crossResidual"],
} as const;
/** Calculate ratio preserving integer rounding residual from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { numerator, denominator, roundedNumerator, roundedDenominator } =
    input;
  const compute = (): Output => {
    H.domain(denominator !== 0 && roundedDenominator !== 0);
    return {
      crossResidual:
        roundedNumerator * denominator - numerator * roundedDenominator,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    numerator: 2,
    denominator: 3,
    roundedNumerator: 3,
    roundedDenominator: 5,
  },
  output: { crossResidual: -1 },
} satisfies ToolExample<Input, Output>;
export const ratioPreservingIntegerRoundingResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "proportions/ratio-preserving-integer-rounding-residual",
      title: "Ratio Preserving Integer Rounding Residual Tool",
      description:
        "Calculate ratio preserving integer rounding residual from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          numerator: { type: "number" },
          denominator: { type: "number" },
          roundedNumerator: { type: "integer" },
          roundedDenominator: { type: "integer" },
        },
        required: [
          "numerator",
          "denominator",
          "roundedNumerator",
          "roundedDenominator",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { crossResidual: { type: "number" } },
        required: ["crossResidual"],
      },
      ports: {
        inputs: [
          {
            id: "numerator",
            label: "Numerator",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "denominator",
            label: "Denominator",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "roundedNumerator",
            label: "Rounded Numerator",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "roundedDenominator",
            label: "Rounded Denominator",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "crossResidual",
            label: "Cross Residual",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ratioPreservingIntegerRoundingResidualTool.execute;
export default ratioPreservingIntegerRoundingResidualTool;
