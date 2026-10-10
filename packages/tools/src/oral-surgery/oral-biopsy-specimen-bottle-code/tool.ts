import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly bottleId: string;
  readonly siteWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    bottleId: { type: "string", maxLength: 8192, minLength: 1 },
    siteWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "bottleId", "siteWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate explicit oral-biopsy specimen, bottle, and site identifiers without tissue classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, bottleId, siteWording } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(bottleId.length > 0, "bottleId");
    H.domain(siteWording.length > 0, "siteWording");
    return { token: JSON.stringify([specimenId, bottleId, siteWording]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenId: "S17", bottleId: "JAR3", siteWording: "site A" },
  output: { token: '["S17","JAR3","site A"]' },
} satisfies ToolExample<Input, Output>;
export const oralBiopsySpecimenBottleCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oral-surgery", "oral surgery", "health and medicine"],
      keywords: ["oral surgery", "health and medicine"],
    },
    id: "oral-surgery/oral-biopsy-specimen-bottle-code",
    title: "Oral Biopsy Specimen Bottle Code",
    description:
      "Associate explicit oral-biopsy specimen, bottle, and site identifiers without tissue classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        bottleId: { type: "string", maxLength: 8192, minLength: 1 },
        siteWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "bottleId", "siteWording"],
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
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "bottleId",
          label: "Bottle Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "siteWording",
          label: "Site Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = oralBiopsySpecimenBottleCodeTool.execute;
export default oralBiopsySpecimenBottleCodeTool;
