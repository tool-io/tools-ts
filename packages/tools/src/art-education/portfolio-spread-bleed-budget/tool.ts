import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pageWidth: number;
  readonly gutter: number;
  readonly outerBleed: number;
};
export type Output = { readonly spreadWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pageWidth: { type: "number", minimum: 0 },
    gutter: { type: "number", minimum: 0 },
    outerBleed: { type: "number", minimum: 0 },
  },
  required: ["pageWidth", "gutter", "outerBleed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { spreadWidth: { type: "number" } },
  required: ["spreadWidth"],
} as const;
/** Calculate portfolio spread bleed budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pageWidth, gutter, outerBleed } = request;
  const compute = (): Output => {
    H.domain(pageWidth >= 0 && gutter >= 0 && outerBleed >= 0);
    return { spreadWidth: 2 * pageWidth + gutter + 2 * outerBleed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pageWidth: 20, gutter: 1, outerBleed: 0.3 },
  output: { spreadWidth: 41.6 },
} satisfies ToolExample<Input, Output>;
export const portfolioSpreadBleedBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/portfolio-spread-bleed-budget",
    title: "Portfolio Spread Bleed Budget Tool",
    description:
      "Calculate portfolio spread bleed budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pageWidth: { type: "number", minimum: 0 },
        gutter: { type: "number", minimum: 0 },
        outerBleed: { type: "number", minimum: 0 },
      },
      required: ["pageWidth", "gutter", "outerBleed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { spreadWidth: { type: "number" } },
      required: ["spreadWidth"],
    },
    ports: {
      inputs: [
        {
          id: "pageWidth",
          label: "Page Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gutter",
          label: "Gutter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outerBleed",
          label: "Outer Bleed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "spreadWidth",
          label: "Spread Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = portfolioSpreadBleedBudgetTool.execute;
export default portfolioSpreadBleedBudgetTool;
