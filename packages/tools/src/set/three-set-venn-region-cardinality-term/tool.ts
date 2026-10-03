import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly ab: number;
  readonly ac: number;
  readonly abc: number;
};
export type Output = { readonly onlyA: number; readonly feasible: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "integer" },
    ab: { type: "integer" },
    ac: { type: "integer" },
    abc: { type: "integer" },
  },
  required: ["a", "ab", "ac", "abc"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { onlyA: { type: "integer" }, feasible: { type: "boolean" } },
  required: ["onlyA", "feasible"],
} as const;
/** Calculate three set venn region cardinality term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { a, ab, ac, abc } = request;
  const compute = (): Output => {
    for (const x of [a, ab, ac, abc]) H.integer(x, 0);
    const onlyA = a - ab - ac + abc;
    return {
      onlyA,
      feasible: onlyA >= 0 && abc <= Math.min(ab, ac) && Math.max(ab, ac) <= a,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { a: 20, ab: 8, ac: 6, abc: 3 },
  output: { onlyA: 9, feasible: true },
} satisfies ToolExample<Input, Output>;
export const threeSetVennRegionCardinalityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/three-set-venn-region-cardinality-term",
    title: "Three Set Venn Region Cardinality Term Tool",
    description:
      "Calculate three set venn region cardinality term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        a: { type: "integer" },
        ab: { type: "integer" },
        ac: { type: "integer" },
        abc: { type: "integer" },
      },
      required: ["a", "ab", "ac", "abc"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { onlyA: { type: "integer" }, feasible: { type: "boolean" } },
      required: ["onlyA", "feasible"],
    },
    ports: {
      inputs: [
        { id: "a", label: "A", required: true, valueType: { type: "integer" } },
        {
          id: "ab",
          label: "Ab",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "ac",
          label: "Ac",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "abc",
          label: "Abc",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "onlyA", label: "Only A", valueType: { type: "integer" } },
        { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = threeSetVennRegionCardinalityTermTool.execute;
export default threeSetVennRegionCardinalityTermTool;
