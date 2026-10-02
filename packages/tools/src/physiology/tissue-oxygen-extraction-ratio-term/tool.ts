import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arterialContent: number;
  readonly venousContent: number;
  readonly flow: number;
};
export type Output = {
  readonly difference: number;
  readonly extractionFraction: number;
  readonly oxygenFlux: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arterialContent: { type: "number", exclusiveMinimum: 0 },
    venousContent: { type: "number", minimum: 0 },
    flow: { type: "number", minimum: 0 },
  },
  required: ["arterialContent", "venousContent", "flow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    extractionFraction: { type: "number" },
    oxygenFlux: { type: "number" },
  },
  required: ["difference", "extractionFraction", "oxygenFlux"],
} as const;
/** Descriptive supplied oxygen-content extraction and flow product, without a tissue physiology or clinical threshold model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arterialContent, venousContent, flow } = request;
  const compute = (): Output => {
    H.positive(arterialContent);
    H.domain(venousContent >= 0 && flow >= 0);
    return {
      difference: arterialContent - venousContent,
      extractionFraction: (arterialContent - venousContent) / arterialContent,
      oxygenFlux: flow * (arterialContent - venousContent),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { arterialContent: 200, venousContent: 150, flow: 5 },
  output: { difference: 50, extractionFraction: 0.25, oxygenFlux: 250 },
} satisfies ToolExample<Input, Output>;
export const tissueOxygenExtractionRatioTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/tissue-oxygen-extraction-ratio-term",
    title: "Tissue Oxygen Extraction Ratio Term Tool",
    description:
      "Descriptive supplied oxygen-content extraction and flow product, without a tissue physiology or clinical threshold model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arterialContent: { type: "number", exclusiveMinimum: 0 },
        venousContent: { type: "number", minimum: 0 },
        flow: { type: "number", minimum: 0 },
      },
      required: ["arterialContent", "venousContent", "flow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        difference: { type: "number" },
        extractionFraction: { type: "number" },
        oxygenFlux: { type: "number" },
      },
      required: ["difference", "extractionFraction", "oxygenFlux"],
    },
    ports: {
      inputs: [
        {
          id: "arterialContent",
          label: "Arterial Content",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "venousContent",
          label: "Venous Content",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "flow",
          label: "Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
        {
          id: "extractionFraction",
          label: "Extraction Fraction",
          valueType: { type: "number" },
        },
        {
          id: "oxygenFlux",
          label: "Oxygen Flux",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tissueOxygenExtractionRatioTermTool.execute;
export default tissueOxygenExtractionRatioTermTool;
