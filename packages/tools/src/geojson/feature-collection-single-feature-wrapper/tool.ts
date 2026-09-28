import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly featureJson: string };
export type Output = { readonly collectionJson: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { featureJson: { type: "string", maxLength: 8192 } },
  required: ["featureJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { collectionJson: { type: "string", maxLength: 8192 } },
  required: ["collectionJson"],
} as const;
/** Wrap one structurally identified GeoJSON Feature in a FeatureCollection without revalidating its nested geometry. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { featureJson } = input;
  const compute = (): Output => {
    const f = H.plain(H.parseJson(featureJson));
    H.domain(
      f.type === "Feature" &&
        Object.hasOwn(f, "geometry") &&
        Object.hasOwn(f, "properties"),
    );
    return {
      collectionJson: JSON.stringify({
        type: "FeatureCollection",
        features: [f],
      }),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { featureJson: '{"type":"Feature","geometry":null,"properties":{}}' },
  output: {
    collectionJson:
      '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":null,"properties":{}}]}',
  },
} satisfies ToolExample<Input, Output>;
export const featureCollectionSingleFeatureWrapperTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geojson/feature-collection-single-feature-wrapper",
      title: "Feature Collection Single Feature Wrapper Tool",
      description:
        "Wrap one structurally identified GeoJSON Feature in a FeatureCollection without revalidating its nested geometry.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { featureJson: { type: "string", maxLength: 8192 } },
        required: ["featureJson"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { collectionJson: { type: "string", maxLength: 8192 } },
        required: ["collectionJson"],
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
            id: "collectionJson",
            label: "Collection Json",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = featureCollectionSingleFeatureWrapperTool.execute;
export default featureCollectionSingleFeatureWrapperTool;
