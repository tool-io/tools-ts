import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly secchiDepth: number;
  readonly suppliedProduct: number;
  readonly referenceExtinction: number;
};
export type Output = {
  readonly conditionalExtinction: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    secchiDepth: { type: "number", exclusiveMinimum: 0 },
    suppliedProduct: { type: "number", minimum: 0 },
    referenceExtinction: { type: "number", minimum: 0 },
  },
  required: ["secchiDepth", "suppliedProduct", "referenceExtinction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditionalExtinction: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["conditionalExtinction", "referenceGap"],
} as const;
/** Conditional empirical extinction/depth product with a supplied coefficient, not a universal Secchi conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { secchiDepth, suppliedProduct, referenceExtinction } = request;
  const compute = (): Output => {
    H.positive(secchiDepth);
    H.domain(suppliedProduct >= 0 && referenceExtinction >= 0);
    return {
      conditionalExtinction: suppliedProduct / secchiDepth,
      referenceGap: suppliedProduct / secchiDepth - referenceExtinction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { secchiDepth: 2, suppliedProduct: 1.6, referenceExtinction: 0.7 },
  output: { conditionalExtinction: 0.8, referenceGap: 0.10000000000000009 },
} satisfies ToolExample<Input, Output>;
export const secchiExtinctionReferenceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/secchi-extinction-reference-factor",
    title: "Secchi Extinction Reference Factor Tool",
    description:
      "Conditional empirical extinction/depth product with a supplied coefficient, not a universal Secchi conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        secchiDepth: { type: "number", exclusiveMinimum: 0 },
        suppliedProduct: { type: "number", minimum: 0 },
        referenceExtinction: { type: "number", minimum: 0 },
      },
      required: ["secchiDepth", "suppliedProduct", "referenceExtinction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conditionalExtinction: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["conditionalExtinction", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "secchiDepth",
          label: "Secchi Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedProduct",
          label: "Supplied Product",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceExtinction",
          label: "Reference Extinction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "conditionalExtinction",
          label: "Conditional Extinction",
          valueType: { type: "number" },
        },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = secchiExtinctionReferenceFactorTool.execute;
export default secchiExtinctionReferenceFactorTool;
