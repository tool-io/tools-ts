import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceId: string;
  readonly geographyId: string;
  readonly vintageText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    geographyId: { type: "string", maxLength: 8192, minLength: 1 },
    vintageText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceId", "geographyId", "vintageText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate a supplied source with explicit geography and boundary vintage without harmonizing regions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, geographyId, vintageText } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(geographyId.length > 0, "geographyId");
    H.domain(vintageText.length > 0, "vintageText");
    return { token: JSON.stringify([sourceId, geographyId, vintageText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceId: "S17", geographyId: "G4", vintageText: "1990 boundaries" },
  output: { token: '["S17","G4","1990 boundaries"]' },
} satisfies ToolExample<Input, Output>;
export const areaStudySourceGeographyVintageTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["area-studies", "area studies", "humanities"],
      keywords: ["area studies", "humanities"],
    },
    id: "area-studies/area-study-source-geography-vintage",
    title: "Area Study Source Geography Vintage",
    description:
      "Associate a supplied source with explicit geography and boundary vintage without harmonizing regions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        geographyId: { type: "string", maxLength: 8192, minLength: 1 },
        vintageText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sourceId", "geographyId", "vintageText"],
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
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "geographyId",
          label: "Geography Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "vintageText",
          label: "Vintage Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = areaStudySourceGeographyVintageTool.execute;
export default areaStudySourceGeographyVintageTool;
