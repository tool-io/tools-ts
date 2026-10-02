import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly net: number; readonly overheadFraction: number };
export type Output = {
  readonly gross: number;
  readonly markupFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    net: { type: "number" },
    overheadFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["net", "overheadFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gross: { type: "number" }, markupFraction: { type: "number" } },
  required: ["gross", "markupFraction"],
} as const;
/** Calculate proportional overhead net gross base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { net, overheadFraction } = request;
  const compute = (): Output => {
    H.domain(overheadFraction >= 0 && overheadFraction < 1);
    return {
      gross: net / (1 - overheadFraction),
      markupFraction: overheadFraction / (1 - overheadFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { net: 80, overheadFraction: 0.2 },
  output: { gross: 100, markupFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const proportionalOverheadNetGrossBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/proportional-overhead-net-gross-base",
    title: "Proportional Overhead Net Gross Base Tool",
    description:
      "Calculate proportional overhead net gross base from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        net: { type: "number" },
        overheadFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["net", "overheadFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gross: { type: "number" },
        markupFraction: { type: "number" },
      },
      required: ["gross", "markupFraction"],
    },
    ports: {
      inputs: [
        {
          id: "net",
          label: "Net",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overheadFraction",
          label: "Overhead Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gross", label: "Gross", valueType: { type: "number" } },
        {
          id: "markupFraction",
          label: "Markup Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = proportionalOverheadNetGrossBaseTool.execute;
export default proportionalOverheadNetGrossBaseTool;
