import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { isPortableJsonValue } from "../../core/json-value.js";
export type Input = {
  readonly propertiesJson: string;
  readonly removeNulls: boolean;
};
export type Output = {
  readonly propertiesJson: string;
  readonly removedNames: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    propertiesJson: { type: "string", maxLength: 8192 },
    removeNulls: { type: "boolean" },
  },
  required: ["propertiesJson", "removeNulls"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    propertiesJson: { type: "string", maxLength: 8192 },
    removedNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["propertiesJson", "removedNames"],
} as const;
/** Remove only top-level explicit null members from a supplied GeoJSON properties object under a caller-selected policy, preserving other values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { propertiesJson, removeNulls } = request;
  const compute = (): Output => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(propertiesJson);
    } catch {
      H.domain(false, "propertiesJson");
    }
    H.domain(
      parsed !== null && typeof parsed === "object" && !Array.isArray(parsed),
      "propertiesJson",
    );
    H.domain(isPortableJsonValue(parsed), "propertiesJson");
    const entries = Object.entries(parsed);
    const removedNames = removeNulls
      ? entries.filter(([, value]) => value === null).map(([name]) => name)
      : [];
    return {
      propertiesJson: JSON.stringify(
        Object.fromEntries(
          entries.filter(([name]) => !removedNames.includes(name)),
        ),
      ),
      removedNames,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { propertiesJson: '{"a":null,"b":2}', removeNulls: true },
  output: { propertiesJson: '{"b":2}', removedNames: ["a"] },
} satisfies ToolExample<Input, Output>;
export const featurePropertyNullRemovalChoiceTool = H.defineSchemaCalculation<
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
    id: "geojson/feature-property-null-removal-choice",
    title: "Feature Property Null Removal Choice",
    description:
      "Remove only top-level explicit null members from a supplied GeoJSON properties object under a caller-selected policy, preserving other values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        propertiesJson: { type: "string", maxLength: 8192 },
        removeNulls: { type: "boolean" },
      },
      required: ["propertiesJson", "removeNulls"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        propertiesJson: { type: "string", maxLength: 8192 },
        removedNames: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["propertiesJson", "removedNames"],
    },
    ports: {
      inputs: [
        {
          id: "propertiesJson",
          label: "Properties Json",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "removeNulls",
          label: "Remove Nulls",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "propertiesJson",
          label: "Properties Json",
          valueType: { type: "string" },
        },
        {
          id: "removedNames",
          label: "Removed Names",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = featurePropertyNullRemovalChoiceTool.execute;
export default featurePropertyNullRemovalChoiceTool;
