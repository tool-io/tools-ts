import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly featureJson: string };
export type Output = { readonly foreignMembersJson: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { featureJson: { type: "string", maxLength: 8192 } },
  required: ["featureJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { foreignMembersJson: { type: "string", maxLength: 8192 } },
  required: ["foreignMembersJson"],
} as const;
/** Extract the foreign top-level members of a GeoJSON Feature, excluding the five RFC 7946 Feature members. Geometry content is not validated. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { featureJson } = request;
  const compute = (): Output => {
    const feature = H.plain(H.parseJson(featureJson));
    H.domain(feature.type === "Feature", "featureJson");
    return {
      foreignMembersJson: JSON.stringify(
        Object.fromEntries(
          Object.entries(feature).filter(
            ([k]) =>
              !["type", "geometry", "properties", "id", "bbox"].includes(k),
          ),
        ),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    featureJson:
      '{"type":"Feature","geometry":null,"properties":null,"source":"survey","revision":2}',
  },
  output: { foreignMembersJson: '{"source":"survey","revision":2}' },
} satisfies ToolExample<Input, Output>;
export const featureForeignMemberExtractorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/feature-foreign-member-extractor",
    title: "Feature Foreign Member Extractor Tool",
    description:
      "Extract the foreign top-level members of a GeoJSON Feature, excluding the five RFC 7946 Feature members. Geometry content is not validated.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { featureJson: { type: "string", maxLength: 8192 } },
      required: ["featureJson"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { foreignMembersJson: { type: "string", maxLength: 8192 } },
      required: ["foreignMembersJson"],
    },
    ports: {
      inputs: [
        {
          id: "featureJson",
          label: "Feature Json",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "foreignMembersJson",
          label: "Foreign Members Json",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = featureForeignMemberExtractorTool.execute;
export default featureForeignMemberExtractorTool;
