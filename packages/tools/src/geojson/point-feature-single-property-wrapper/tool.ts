import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly position: readonly number[];
  readonly key: string;
  readonly valueJson: string;
};
export type Output = { readonly featureJson: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    position: { type: "array", maxItems: 256, items: { type: "number" } },
    key: { type: "string", maxLength: 8192 },
    valueJson: { type: "string", maxLength: 8192 },
  },
  required: ["position", "key", "valueJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { featureJson: { type: "string", maxLength: 8192 } },
  required: ["featureJson"],
} as const;
/** Calculate point feature single property wrapper from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { position, key, valueJson } = request;
  const compute = (): Output => {
    H.domain(position.length >= 2);
    const value = H.parseJson(valueJson);
    return {
      featureJson: JSON.stringify({
        type: "Feature",
        geometry: { type: "Point", coordinates: position },
        properties: Object.fromEntries([[key, value]]),
      }),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { position: [1, 2], key: "name", valueJson: '"Park"' },
  output: {
    featureJson:
      '{"type":"Feature","geometry":{"type":"Point","coordinates":[1,2]},"properties":{"name":"Park"}}',
  },
} satisfies ToolExample<Input, Output>;
export const pointFeatureSinglePropertyWrapperTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/point-feature-single-property-wrapper",
    title: "Point Feature Single Property Wrapper Tool",
    description:
      "Calculate point feature single property wrapper from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        position: { type: "array", maxItems: 256, items: { type: "number" } },
        key: { type: "string", maxLength: 8192 },
        valueJson: { type: "string", maxLength: 8192 },
      },
      required: ["position", "key", "valueJson"],
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
          id: "position",
          label: "Position",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "key",
          label: "Key",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "valueJson",
          label: "Value Json",
          required: true,
          valueType: { type: "string" },
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
export const run = pointFeatureSinglePropertyWrapperTool.execute;
export default pointFeatureSinglePropertyWrapperTool;
