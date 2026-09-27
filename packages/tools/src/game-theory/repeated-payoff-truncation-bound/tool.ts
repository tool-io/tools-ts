import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly discountFactor: number;
  readonly maxAbsoluteStagePayoff: number;
  readonly omittedFrom: number;
};
export type Output = { readonly absoluteTailBound: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discountFactor: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    maxAbsoluteStagePayoff: { type: "number", minimum: 0 },
    omittedFrom: { type: "integer", minimum: 0 },
  },
  required: ["discountFactor", "maxAbsoluteStagePayoff", "omittedFrom"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { absoluteTailBound: { type: "number" } },
  required: ["absoluteTailBound"],
} as const;
/** Geometric absolute bound on an unnormalized discounted payoff tail, indexed from period zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { discountFactor, maxAbsoluteStagePayoff, omittedFrom } = request;
  const compute = (): Output => {
    H.domain(
      discountFactor >= 0 && discountFactor < 1 && maxAbsoluteStagePayoff >= 0,
    );
    H.integer(omittedFrom, 0);
    return {
      absoluteTailBound:
        (maxAbsoluteStagePayoff * discountFactor ** omittedFrom) /
        (1 - discountFactor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { discountFactor: 0.5, maxAbsoluteStagePayoff: 10, omittedFrom: 3 },
  output: { absoluteTailBound: 2.5 },
} satisfies ToolExample<Input, Output>;
export const repeatedPayoffTruncationBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/repeated-payoff-truncation-bound",
    title: "Repeated Payoff Truncation Bound Tool",
    description:
      "Geometric absolute bound on an unnormalized discounted payoff tail, indexed from period zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        discountFactor: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        maxAbsoluteStagePayoff: { type: "number", minimum: 0 },
        omittedFrom: { type: "integer", minimum: 0 },
      },
      required: ["discountFactor", "maxAbsoluteStagePayoff", "omittedFrom"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { absoluteTailBound: { type: "number" } },
      required: ["absoluteTailBound"],
    },
    ports: {
      inputs: [
        {
          id: "discountFactor",
          label: "Discount Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maxAbsoluteStagePayoff",
          label: "Max Absolute Stage Payoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "omittedFrom",
          label: "Omitted From",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "absoluteTailBound",
          label: "Absolute Tail Bound",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = repeatedPayoffTruncationBoundTool.execute;
export default repeatedPayoffTruncationBoundTool;
