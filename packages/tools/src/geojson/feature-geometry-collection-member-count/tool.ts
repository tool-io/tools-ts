import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  parseJson,
  plain,
  list,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly featureJson: string };
export type Output = { readonly count: number; readonly nullGeometry: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { featureJson: { type: "string", maxLength: 8192 } },
  required: ["featureJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" }, nullGeometry: { type: "boolean" } },
  required: ["count", "nullGeometry"],
} as const;
/** Compute feature geometry collection member count from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { featureJson } = input;
  const compute = (): Output => {
    const f = plain(parseJson(featureJson));
    domain(f.type === "Feature");
    if (f.geometry === null) return { count: 0, nullGeometry: true };
    const g = plain(f.geometry);
    domain(g.type === "GeometryCollection");
    return { count: list(g.geometries).length, nullGeometry: false };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    featureJson:
      '{"type":"Feature","geometry":{"type":"GeometryCollection","geometries":[]},"properties":{}}',
  },
  output: { count: 0, nullGeometry: false },
} satisfies ToolExample<Input, Output>;
export const featureGeometryCollectionMemberCountTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geojson/feature-geometry-collection-member-count",
  title: "Feature Geometry Collection Member Count Tool",
  description:
    "Compute feature geometry collection member count from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
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
      { id: "count", label: "Count", valueType: { type: "integer" } },
      {
        id: "nullGeometry",
        label: "Null Geometry",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = featureGeometryCollectionMemberCountTool.execute;
export default featureGeometryCollectionMemberCountTool;
