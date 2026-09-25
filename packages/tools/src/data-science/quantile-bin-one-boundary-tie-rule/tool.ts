import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly boundaries: readonly number[];
  readonly equalGoesUpper: boolean;
};
export type Output = { readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    boundaries: { type: "array", maxItems: 256, items: { type: "number" } },
    equalGoesUpper: { type: "boolean" },
  },
  required: ["value", "boundaries", "equalGoesUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "integer" } },
  required: ["index"],
} as const;
/** Calculate quantile bin one boundary tie rule from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, boundaries, equalGoesUpper } = request;
  const compute = (): Output => {
    H.domain(boundaries.every((x, i) => i === 0 || x > boundaries[i - 1]));
    return {
      index: boundaries.filter((x) => (equalGoesUpper ? value >= x : value > x))
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 5, boundaries: [2, 5, 8], equalGoesUpper: true },
  output: { index: 2 },
} satisfies ToolExample<Input, Output>;
export const quantileBinOneBoundaryTieRuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/quantile-bin-one-boundary-tie-rule",
    title: "Quantile Bin One Boundary Tie Rule Tool",
    description:
      "Calculate quantile bin one boundary tie rule from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        boundaries: { type: "array", maxItems: 256, items: { type: "number" } },
        equalGoesUpper: { type: "boolean" },
      },
      required: ["value", "boundaries", "equalGoesUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { index: { type: "integer" } },
      required: ["index"],
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
          id: "boundaries",
          label: "Boundaries",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "equalGoesUpper",
          label: "Equal Goes Upper",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = quantileBinOneBoundaryTieRuleTool.execute;
export default quantileBinOneBoundaryTieRuleTool;
