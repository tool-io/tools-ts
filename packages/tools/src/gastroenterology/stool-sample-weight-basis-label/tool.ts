import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly massGrams: number;
  readonly dryBasis: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    massGrams: { type: "number", minimum: 0 },
    dryBasis: { type: "boolean" },
  },
  required: ["sampleId", "massGrams", "dryBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied stool-sample mass and its recorded wet/dry basis without converting the basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, massGrams, dryBasis } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(massGrams >= 0, "massGrams");
    return {
      label:
        sampleId +
        "; " +
        massGrams +
        " g [" +
        (dryBasis ? "dry" : "wet") +
        " mass]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleId: "S17", massGrams: 2.5, dryBasis: false },
  output: { label: "S17; 2.5 g [wet mass]" },
} satisfies ToolExample<Input, Output>;
export const stoolSampleWeightBasisLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gastroenterology", "health and medicine"],
      keywords: ["gastroenterology", "health and medicine"],
    },
    id: "gastroenterology/stool-sample-weight-basis-label",
    title: "Stool Sample Weight Basis Label",
    description:
      "Label a supplied stool-sample mass and its recorded wet/dry basis without converting the basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        massGrams: { type: "number", minimum: 0 },
        dryBasis: { type: "boolean" },
      },
      required: ["sampleId", "massGrams", "dryBasis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "massGrams",
          label: "Mass Grams",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryBasis",
          label: "Dry Basis",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = stoolSampleWeightBasisLabelTool.execute;
export default stoolSampleWeightBasisLabelTool;
