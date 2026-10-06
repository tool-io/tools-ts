import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regionId: string;
  readonly jurisdictionText: string;
  readonly sourceId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regionId: { type: "string", maxLength: 8192, minLength: 1 },
    jurisdictionText: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["regionId", "jurisdictionText", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode supplied historical region, jurisdiction transcription and source identifiers without determining boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regionId, jurisdictionText, sourceId } = request;
  const compute = (): Output => {
    H.domain(regionId.length > 0, "regionId");
    H.domain(jurisdictionText.length > 0, "jurisdictionText");
    H.domain(sourceId.length > 0, "sourceId");
    return { token: JSON.stringify([regionId, jurisdictionText, sourceId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { regionId: "R17", jurisdictionText: "District A", sourceId: "S4" },
  output: { token: '["R17","District A","S4"]' },
} satisfies ToolExample<Input, Output>;
export const historicalRegionJurisdictionSourceKeyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["area-studies", "area studies", "humanities"],
        keywords: ["area studies", "humanities"],
      },
      id: "area-studies/historical-region-jurisdiction-source-key",
      title: "Historical Region Jurisdiction Source Key",
      description:
        "Encode supplied historical region, jurisdiction transcription and source identifiers without determining boundaries.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          regionId: { type: "string", maxLength: 8192, minLength: 1 },
          jurisdictionText: { type: "string", maxLength: 8192, minLength: 1 },
          sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["regionId", "jurisdictionText", "sourceId"],
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
            id: "regionId",
            label: "Region Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "jurisdictionText",
            label: "Jurisdiction Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceId",
            label: "Source Id",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = historicalRegionJurisdictionSourceKeyTool.execute;
export default historicalRegionJurisdictionSourceKeyTool;
