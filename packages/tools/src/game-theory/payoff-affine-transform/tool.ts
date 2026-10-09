import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly payoff: number;
  readonly positiveScale: number;
  readonly offset: number;
};
export type Output = { readonly transformedPayoff: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    payoff: { type: "number" },
    positiveScale: { type: "number", exclusiveMinimum: 0 },
    offset: { type: "number" },
  },
  required: ["payoff", "positiveScale", "offset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { transformedPayoff: { type: "number" } },
  required: ["transformedPayoff"],
} as const;
/** Apply an explicit positive affine transformation to one payoff without comparing interpersonal utilities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { payoff, positiveScale, offset } = request;
  const compute = (): Output => {
    (H.domain(positiveScale > 0, "positiveScale"), positiveScale);
    return { transformedPayoff: positiveScale * payoff + offset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { payoff: 3, positiveScale: 2, offset: 5 },
  output: { transformedPayoff: 11 },
} satisfies ToolExample<Input, Output>;
export const payoffAffineTransformTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["game-theory", "game theory", "economics"],
      keywords: ["game theory", "economics"],
    },
    id: "game-theory/payoff-affine-transform",
    title: "Payoff Affine Transform",
    description:
      "Apply an explicit positive affine transformation to one payoff without comparing interpersonal utilities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        payoff: { type: "number" },
        positiveScale: { type: "number", exclusiveMinimum: 0 },
        offset: { type: "number" },
      },
      required: ["payoff", "positiveScale", "offset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { transformedPayoff: { type: "number" } },
      required: ["transformedPayoff"],
    },
    ports: {
      inputs: [
        {
          id: "payoff",
          label: "Payoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveScale",
          label: "Positive Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "transformedPayoff",
          label: "Transformed Payoff",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = payoffAffineTransformTool.execute;
export default payoffAffineTransformTool;
