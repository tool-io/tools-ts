import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  probability,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly intersection: number;
  readonly leftOnly: number;
  readonly rightOnly: number;
  readonly alpha: number;
  readonly beta: number;
  readonly emptyValue: number;
};
export type Output = { readonly defined: boolean; readonly score: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersection: { type: "integer", minimum: 0 },
    leftOnly: { type: "integer", minimum: 0 },
    rightOnly: { type: "integer", minimum: 0 },
    alpha: { type: "number" },
    beta: { type: "number" },
    emptyValue: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "intersection",
    "leftOnly",
    "rightOnly",
    "alpha",
    "beta",
    "emptyValue",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { defined: { type: "boolean" }, score: { type: "number" } },
  required: ["defined", "score"],
} as const;
/** Compute tversky empty reference policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { intersection, leftOnly, rightOnly, alpha, beta, emptyValue } = input;
  const compute = (): Output => {
    integer(intersection);
    integer(leftOnly);
    integer(rightOnly);
    domain(alpha >= 0 && beta >= 0);
    probability(emptyValue);
    const d = intersection + alpha * leftOnly + beta * rightOnly;
    return { defined: d !== 0, score: d === 0 ? emptyValue : intersection / d };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    intersection: 0,
    leftOnly: 0,
    rightOnly: 0,
    alpha: 1,
    beta: 1,
    emptyValue: 1,
  },
  output: { defined: false, score: 1 },
} satisfies ToolExample<Input, Output>;
export const tverskyEmptyReferencePolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "similarity/tversky-empty-reference-policy",
  title: "Tversky Empty Reference Policy Tool",
  description:
    "Compute tversky empty reference policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "intersection",
        label: "Intersection",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "leftOnly",
        label: "Left Only",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "rightOnly",
        label: "Right Only",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "alpha",
        label: "Alpha",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "beta",
        label: "Beta",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "emptyValue",
        label: "Empty Value",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      { id: "score", label: "Score", valueType: { type: "number" } },
    ],
  },
});
export const run = tverskyEmptyReferencePolicyTool.execute;
export default tverskyEmptyReferencePolicyTool;
