import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly suppliedSite: string;
  readonly laterality: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSite: { type: "string", maxLength: 8192, minLength: 1 },
    laterality: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "suppliedSite", "laterality"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit skin-sample site and laterality labels without normalizing an anatomic ontology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, suppliedSite, laterality } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(suppliedSite.length > 0, "suppliedSite");
    H.domain(laterality.length > 0, "laterality");
    return { token: JSON.stringify([sampleId, suppliedSite, laterality]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleId: "S17", suppliedSite: "forearm", laterality: "left" },
  output: { token: '["S17","forearm","left"]' },
} satisfies ToolExample<Input, Output>;
export const skinSampleAnatomicLateralityPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/skin-sample-anatomic-laterality-pair",
    title: "Skin Sample Anatomic Laterality Pair Tool",
    description:
      "Preserve explicit skin-sample site and laterality labels without normalizing an anatomic ontology.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedSite: { type: "string", maxLength: 8192, minLength: 1 },
        laterality: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "suppliedSite", "laterality"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
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
          id: "suppliedSite",
          label: "Supplied Site",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "laterality",
          label: "Laterality",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = skinSampleAnatomicLateralityPairTool.execute;
export default skinSampleAnatomicLateralityPairTool;
