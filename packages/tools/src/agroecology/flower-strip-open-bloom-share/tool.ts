import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openBloomLength: number;
  readonly surveyedStripLength: number;
};
export type Output = { readonly openBloomFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openBloomLength: { type: "number", minimum: 0 },
    surveyedStripLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["openBloomLength", "surveyedStripLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { openBloomFraction: { type: "number" } },
  required: ["openBloomFraction"],
} as const;
/** Express observed open-bloom strip length as a share of an explicitly surveyed strip length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openBloomLength, surveyedStripLength } = request;
  const compute = (): Output => {
    (H.domain(surveyedStripLength > 0, "surveyedStripLength"),
      surveyedStripLength);
    H.domain(
      openBloomLength >= 0 && openBloomLength <= surveyedStripLength,
      "openBloomLength",
    );
    return { openBloomFraction: openBloomLength / surveyedStripLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openBloomLength: 18, surveyedStripLength: 60 },
  output: { openBloomFraction: 0.3 },
} satisfies ToolExample<Input, Output>;
export const flowerStripOpenBloomShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroecology", "agriculture"],
      keywords: ["agroecology", "agriculture"],
    },
    id: "agroecology/flower-strip-open-bloom-share",
    title: "Flower Strip Open Bloom Share",
    description:
      "Express observed open-bloom strip length as a share of an explicitly surveyed strip length.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openBloomLength: { type: "number", minimum: 0 },
        surveyedStripLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["openBloomLength", "surveyedStripLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { openBloomFraction: { type: "number" } },
      required: ["openBloomFraction"],
    },
    ports: {
      inputs: [
        {
          id: "openBloomLength",
          label: "Open Bloom Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "surveyedStripLength",
          label: "Surveyed Strip Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "openBloomFraction",
          label: "Open Bloom Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = flowerStripOpenBloomShareTool.execute;
export default flowerStripOpenBloomShareTool;
