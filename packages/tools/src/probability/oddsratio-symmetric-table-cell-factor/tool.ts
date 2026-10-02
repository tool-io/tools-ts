import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
  readonly scaleFirstRow: number;
};
export type Output = {
  readonly oddsRatio: number;
  readonly scaledOddsRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "number", exclusiveMinimum: 0 },
    b: { type: "number", exclusiveMinimum: 0 },
    c: { type: "number", exclusiveMinimum: 0 },
    d: { type: "number", exclusiveMinimum: 0 },
    scaleFirstRow: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["a", "b", "c", "d", "scaleFirstRow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oddsRatio: { type: "number" },
    scaledOddsRatio: { type: "number" },
  },
  required: ["oddsRatio", "scaledOddsRatio"],
} as const;
/** Calculate oddsratio symmetric table cell factor from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { a, b, c, d, scaleFirstRow } = input;
  const compute = (): Output => {
    H.positive(a);
    H.positive(b);
    H.positive(c);
    H.positive(d);
    H.positive(scaleFirstRow);
    return {
      oddsRatio: (a * d) / (b * c),
      scaledOddsRatio: (a * scaleFirstRow * d) / (b * scaleFirstRow * c),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a: 2, b: 3, c: 4, d: 6, scaleFirstRow: 5 },
  output: { oddsRatio: 1, scaledOddsRatio: 1 },
} satisfies ToolExample<Input, Output>;
export const oddsratioSymmetricTableCellFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/oddsratio-symmetric-table-cell-factor",
    title: "Oddsratio Symmetric Table Cell Factor Tool",
    description:
      "Calculate oddsratio symmetric table cell factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        a: { type: "number", exclusiveMinimum: 0 },
        b: { type: "number", exclusiveMinimum: 0 },
        c: { type: "number", exclusiveMinimum: 0 },
        d: { type: "number", exclusiveMinimum: 0 },
        scaleFirstRow: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["a", "b", "c", "d", "scaleFirstRow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oddsRatio: { type: "number" },
        scaledOddsRatio: { type: "number" },
      },
      required: ["oddsRatio", "scaledOddsRatio"],
    },
    ports: {
      inputs: [
        { id: "a", label: "A", required: true, valueType: { type: "number" } },
        { id: "b", label: "B", required: true, valueType: { type: "number" } },
        { id: "c", label: "C", required: true, valueType: { type: "number" } },
        { id: "d", label: "D", required: true, valueType: { type: "number" } },
        {
          id: "scaleFirstRow",
          label: "Scale First Row",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "oddsRatio", label: "Odds Ratio", valueType: { type: "number" } },
        {
          id: "scaledOddsRatio",
          label: "Scaled Odds Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = oddsratioSymmetricTableCellFactorTool.execute;
export default oddsratioSymmetricTableCellFactorTool;
