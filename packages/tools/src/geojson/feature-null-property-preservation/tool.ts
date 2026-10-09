import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly featureId: string;
  readonly propertyName: string;
  readonly preserveNull: boolean;
};
export type Output = { readonly featureJson: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    featureId: { type: "string", maxLength: 8192 },
    propertyName: { type: "string", maxLength: 8192, minLength: 0 },
    preserveNull: { type: "boolean" },
  },
  required: ["featureId", "propertyName", "preserveNull"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { featureJson: { type: "string", maxLength: 8192 } },
  required: ["featureJson"],
} as const;
/** Build an explicit null-geometry GeoJSON Feature with an optional retained null property; omission and null are distinct. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { featureId, propertyName, preserveNull } = request;
  const compute = (): Output => {
    return {
      featureJson: JSON.stringify({
        type: "Feature",
        id: featureId,
        geometry: null,
        properties: preserveNull ? { [propertyName]: null } : {},
      }),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { featureId: "F17", propertyName: "note", preserveNull: true },
  output: {
    featureJson:
      '{"type":"Feature","id":"F17","geometry":null,"properties":{"note":null}}',
  },
} satisfies ToolExample<Input, Output>;
export const featureNullPropertyPreservationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["geojson", "computer science"],
      keywords: ["GeoJSON", "computer science"],
    },
    id: "geojson/feature-null-property-preservation",
    title: "Feature Null Property Preservation",
    description:
      "Build an explicit null-geometry GeoJSON Feature with an optional retained null property; omission and null are distinct.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        featureId: { type: "string", maxLength: 8192 },
        propertyName: { type: "string", maxLength: 8192, minLength: 0 },
        preserveNull: { type: "boolean" },
      },
      required: ["featureId", "propertyName", "preserveNull"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { featureJson: { type: "string", maxLength: 8192 } },
      required: ["featureJson"],
    },
    ports: {
      inputs: [
        {
          id: "featureId",
          label: "Feature Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "propertyName",
          label: "Property Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "preserveNull",
          label: "Preserve Null",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "featureJson",
          label: "Feature Json",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = featureNullPropertyPreservationTool.execute;
export default featureNullPropertyPreservationTool;
