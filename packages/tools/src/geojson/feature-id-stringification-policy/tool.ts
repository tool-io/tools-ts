import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numericFeatureId: number;
  readonly stringifyId: boolean;
};
export type Output = { readonly idJson: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numericFeatureId: { type: "number" },
    stringifyId: { type: "boolean" },
  },
  required: ["numericFeatureId", "stringifyId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { idJson: { type: "string", maxLength: 8192 } },
  required: ["idJson"],
} as const;
/** Serialize an explicit numeric GeoJSON feature identifier as a JSON number or string under a supplied policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numericFeatureId, stringifyId } = request;
  const compute = (): Output => {
    return {
      idJson: JSON.stringify(
        stringifyId ? String(numericFeatureId) : numericFeatureId,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numericFeatureId: 42, stringifyId: true },
  output: { idJson: '"42"' },
} satisfies ToolExample<Input, Output>;
export const featureIdStringificationPolicyTool = H.defineSchemaCalculation<
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
    id: "geojson/feature-id-stringification-policy",
    title: "Feature ID Stringification Policy",
    description:
      "Serialize an explicit numeric GeoJSON feature identifier as a JSON number or string under a supplied policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numericFeatureId: { type: "number" },
        stringifyId: { type: "boolean" },
      },
      required: ["numericFeatureId", "stringifyId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { idJson: { type: "string", maxLength: 8192 } },
      required: ["idJson"],
    },
    ports: {
      inputs: [
        {
          id: "numericFeatureId",
          label: "Numeric Feature Id",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stringifyId",
          label: "Stringify Id",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "idJson", label: "Id Json", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = featureIdStringificationPolicyTool.execute;
export default featureIdStringificationPolicyTool;
