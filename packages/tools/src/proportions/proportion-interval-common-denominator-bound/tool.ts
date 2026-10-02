import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerNumerator: number;
  readonly upperNumerator: number;
  readonly denominator: number;
};
export type Output = { readonly lower: number; readonly upper: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerNumerator: { type: "number" },
    upperNumerator: { type: "number" },
    denominator: { type: "number" },
  },
  required: ["lowerNumerator", "upperNumerator", "denominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lower: { type: "number" }, upper: { type: "number" } },
  required: ["lower", "upper"],
} as const;
/** Calculate proportion interval common denominator bound from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerNumerator, upperNumerator, denominator } = request;
  const compute = (): Output => {
    H.domain(lowerNumerator <= upperNumerator && denominator !== 0);
    return {
      lower:
        denominator > 0
          ? lowerNumerator / denominator
          : upperNumerator / denominator,
      upper:
        denominator > 0
          ? upperNumerator / denominator
          : lowerNumerator / denominator,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerNumerator: 2, upperNumerator: 6, denominator: -4 },
  output: { lower: -1.5, upper: -0.5 },
} satisfies ToolExample<Input, Output>;
export const proportionIntervalCommonDenominatorBoundTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "proportions/proportion-interval-common-denominator-bound",
      title: "Proportion Interval Common Denominator Bound Tool",
      description:
        "Calculate proportion interval common denominator bound from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowerNumerator: { type: "number" },
          upperNumerator: { type: "number" },
          denominator: { type: "number" },
        },
        required: ["lowerNumerator", "upperNumerator", "denominator"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { lower: { type: "number" }, upper: { type: "number" } },
        required: ["lower", "upper"],
      },
      ports: {
        inputs: [
          {
            id: "lowerNumerator",
            label: "Lower Numerator",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperNumerator",
            label: "Upper Numerator",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "denominator",
            label: "Denominator",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "lower", label: "Lower", valueType: { type: "number" } },
          { id: "upper", label: "Upper", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = proportionIntervalCommonDenominatorBoundTool.execute;
export default proportionIntervalCommonDenominatorBoundTool;
