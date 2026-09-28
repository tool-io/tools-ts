import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly featureJson: string;
  readonly suppliedMemberNames: readonly string[];
};
export type Output = { readonly foreignMemberCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    featureJson: { type: "string", maxLength: 8192 },
    suppliedMemberNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["featureJson", "suppliedMemberNames"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { foreignMemberCount: { type: "integer" } },
  required: ["foreignMemberCount"],
} as const;
/** Count top-level names outside a supplied GeoJSON member set; not a complete Feature validator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { featureJson, suppliedMemberNames } = request;
  const compute = (): Output => {
    const value = H.plain(H.parseJson(featureJson));
    return {
      foreignMemberCount: Object.keys(value).filter(
        (x) => !suppliedMemberNames.includes(x),
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    featureJson:
      '{"type":"Feature","geometry":null,"properties":{},"vendor":5}',
    suppliedMemberNames: ["type", "geometry", "properties", "id", "bbox"],
  },
  output: { foreignMemberCount: 1 },
} satisfies ToolExample<Input, Output>;
export const featureForeignMemberCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/feature-foreign-member-count",
    title: "Feature Foreign Member Count Tool",
    description:
      "Count top-level names outside a supplied GeoJSON member set; not a complete Feature validator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        featureJson: { type: "string", maxLength: 8192 },
        suppliedMemberNames: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["featureJson", "suppliedMemberNames"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { foreignMemberCount: { type: "integer" } },
      required: ["foreignMemberCount"],
    },
    ports: {
      inputs: [
        {
          id: "featureJson",
          label: "Feature Json",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedMemberNames",
          label: "Supplied Member Names",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "foreignMemberCount",
          label: "Foreign Member Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = featureForeignMemberCountTool.execute;
export default featureForeignMemberCountTool;
