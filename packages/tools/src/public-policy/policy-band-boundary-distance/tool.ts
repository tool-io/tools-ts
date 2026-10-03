import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly lower: number;
  readonly upper: number;
};
export type Output = {
  readonly lowerDistance: number;
  readonly upperDistance: number;
  readonly insideInclusive: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["value", "lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerDistance: { type: "number" },
    upperDistance: { type: "number" },
    insideInclusive: { type: "boolean" },
  },
  required: ["lowerDistance", "upperDistance", "insideInclusive"],
} as const;
/** Calculate policy band boundary distance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, lower, upper } = request;
  const compute = (): Output => {
    H.domain(lower <= upper);
    return {
      lowerDistance: value - lower,
      upperDistance: upper - value,
      insideInclusive: value >= lower && value <= upper,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 8, lower: 5, upper: 10 },
  output: { lowerDistance: 3, upperDistance: 2, insideInclusive: true },
} satisfies ToolExample<Input, Output>;
export const policyBandBoundaryDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/policy-band-boundary-distance",
    title: "Policy Band Boundary Distance Tool",
    description:
      "Calculate policy band boundary distance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
      },
      required: ["value", "lower", "upper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerDistance: { type: "number" },
        upperDistance: { type: "number" },
        insideInclusive: { type: "boolean" },
      },
      required: ["lowerDistance", "upperDistance", "insideInclusive"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lowerDistance",
          label: "Lower Distance",
          valueType: { type: "number" },
        },
        {
          id: "upperDistance",
          label: "Upper Distance",
          valueType: { type: "number" },
        },
        {
          id: "insideInclusive",
          label: "Inside Inclusive",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = policyBandBoundaryDistanceTool.execute;
export default policyBandBoundaryDistanceTool;
