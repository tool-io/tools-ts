import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly featureJson: string };
export type Output = {
  readonly present: boolean;
  readonly nullGeometry: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { featureJson: { type: "string", maxLength: 8192 } },
  required: ["featureJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    present: { type: "boolean" },
    nullGeometry: { type: "boolean" },
  },
  required: ["present", "nullGeometry"],
} as const;
/** Calculate feature null geometry presence tag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { featureJson } = request;
  const compute = (): Output => {
    const f = H.plain(H.parseJson(featureJson));
    H.domain(f.type === "Feature");
    const present = Object.hasOwn(f, "geometry");
    return { present, nullGeometry: present && f.geometry === null };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { featureJson: '{"type":"Feature","geometry":null}' },
  output: { present: true, nullGeometry: true },
} satisfies ToolExample<Input, Output>;
export const featureNullGeometryPresenceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/feature-null-geometry-presence-tag",
    title: "Feature Null Geometry Presence Tag Tool",
    description:
      "Calculate feature null geometry presence tag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { featureJson: { type: "string", maxLength: 8192 } },
      required: ["featureJson"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        present: { type: "boolean" },
        nullGeometry: { type: "boolean" },
      },
      required: ["present", "nullGeometry"],
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
        { id: "present", label: "Present", valueType: { type: "boolean" } },
        {
          id: "nullGeometry",
          label: "Null Geometry",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = featureNullGeometryPresenceTagTool.execute;
export default featureNullGeometryPresenceTagTool;
