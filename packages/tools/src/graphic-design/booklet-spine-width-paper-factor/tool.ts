import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pages: number;
  readonly sheetsPerLeaf: number;
  readonly paperCaliper: number;
  readonly coverCaliper: number;
  readonly adhesiveAllowance: number;
};
export type Output = {
  readonly leafCount: number;
  readonly textThickness: number;
  readonly spineWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pages: { type: "integer", minimum: 0 },
    sheetsPerLeaf: { type: "number", exclusiveMinimum: 0 },
    paperCaliper: { type: "number", minimum: 0 },
    coverCaliper: { type: "number", minimum: 0 },
    adhesiveAllowance: { type: "number", minimum: 0 },
  },
  required: [
    "pages",
    "sheetsPerLeaf",
    "paperCaliper",
    "coverCaliper",
    "adhesiveAllowance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leafCount: { type: "number" },
    textThickness: { type: "number" },
    spineWidth: { type: "number" },
  },
  required: ["leafCount", "textThickness", "spineWidth"],
} as const;
/** Simple stacked-leaf spine estimate with explicit material calipers and binding allowance; the multiplier is a supplied effective sheets-per-leaf factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    pages,
    sheetsPerLeaf,
    paperCaliper,
    coverCaliper,
    adhesiveAllowance,
  } = request;
  const compute = (): Output => {
    H.integer(pages, 0);
    H.positive(sheetsPerLeaf);
    H.domain(paperCaliper >= 0 && coverCaliper >= 0 && adhesiveAllowance >= 0);
    return {
      leafCount: pages / 2,
      textThickness: (pages * paperCaliper * sheetsPerLeaf) / 2,
      spineWidth:
        (pages * paperCaliper * sheetsPerLeaf) / 2 +
        2 * coverCaliper +
        adhesiveAllowance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pages: 200,
    sheetsPerLeaf: 1,
    paperCaliper: 0.1,
    coverCaliper: 0.3,
    adhesiveAllowance: 0.4,
  },
  output: { leafCount: 100, textThickness: 10, spineWidth: 11 },
} satisfies ToolExample<Input, Output>;
export const bookletSpineWidthPaperFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/booklet-spine-width-paper-factor",
    title: "Booklet Spine Width Paper Factor Tool",
    description:
      "Simple stacked-leaf spine estimate with explicit material calipers and binding allowance; the multiplier is a supplied effective sheets-per-leaf factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pages: { type: "integer", minimum: 0 },
        sheetsPerLeaf: { type: "number", exclusiveMinimum: 0 },
        paperCaliper: { type: "number", minimum: 0 },
        coverCaliper: { type: "number", minimum: 0 },
        adhesiveAllowance: { type: "number", minimum: 0 },
      },
      required: [
        "pages",
        "sheetsPerLeaf",
        "paperCaliper",
        "coverCaliper",
        "adhesiveAllowance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leafCount: { type: "number" },
        textThickness: { type: "number" },
        spineWidth: { type: "number" },
      },
      required: ["leafCount", "textThickness", "spineWidth"],
    },
    ports: {
      inputs: [
        {
          id: "pages",
          label: "Pages",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sheetsPerLeaf",
          label: "Sheets Per Leaf",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paperCaliper",
          label: "Paper Caliper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coverCaliper",
          label: "Cover Caliper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "adhesiveAllowance",
          label: "Adhesive Allowance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "leafCount", label: "Leaf Count", valueType: { type: "number" } },
        {
          id: "textThickness",
          label: "Text Thickness",
          valueType: { type: "number" },
        },
        {
          id: "spineWidth",
          label: "Spine Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bookletSpineWidthPaperFactorTool.execute;
export default bookletSpineWidthPaperFactorTool;
