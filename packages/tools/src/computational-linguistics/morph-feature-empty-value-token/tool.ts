import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly name: string;
  readonly value: string;
  readonly emptyMarker: string;
};
export type Output = {
  readonly emptyValue: boolean;
  readonly explicitlyMissing: boolean;
  readonly featureKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: 8192 },
    value: { type: "string", maxLength: 8192 },
    emptyMarker: { type: "string", maxLength: 8192 },
  },
  required: ["name", "value", "emptyMarker"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    emptyValue: { type: "boolean" },
    explicitlyMissing: { type: "boolean" },
    featureKey: { type: "string", maxLength: 8192 },
  },
  required: ["emptyValue", "explicitlyMissing", "featureKey"],
} as const;
/** Keep empty feature strings distinct from an explicit missing marker. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { name, value, emptyMarker } = request;
  const compute = (): Output => {
    H.domain(name.length > 0 && emptyMarker.length > 0);
    return {
      emptyValue: value.length === 0,
      explicitlyMissing: value === emptyMarker,
      featureKey: JSON.stringify([name, value]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { name: "Case", value: "", emptyMarker: "_" },
  output: {
    emptyValue: true,
    explicitlyMissing: false,
    featureKey: '["Case",""]',
  },
} satisfies ToolExample<Input, Output>;
export const morphFeatureEmptyValueTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-linguistics/morph-feature-empty-value-token",
    title: "Morph Feature Empty Value Token Tool",
    description:
      "Keep empty feature strings distinct from an explicit missing marker.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string", maxLength: 8192 },
        value: { type: "string", maxLength: 8192 },
        emptyMarker: { type: "string", maxLength: 8192 },
      },
      required: ["name", "value", "emptyMarker"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        emptyValue: { type: "boolean" },
        explicitlyMissing: { type: "boolean" },
        featureKey: { type: "string", maxLength: 8192 },
      },
      required: ["emptyValue", "explicitlyMissing", "featureKey"],
    },
    ports: {
      inputs: [
        {
          id: "name",
          label: "Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "emptyMarker",
          label: "Empty Marker",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "emptyValue",
          label: "Empty Value",
          valueType: { type: "boolean" },
        },
        {
          id: "explicitlyMissing",
          label: "Explicitly Missing",
          valueType: { type: "boolean" },
        },
        {
          id: "featureKey",
          label: "Feature Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = morphFeatureEmptyValueTokenTool.execute;
export default morphFeatureEmptyValueTokenTool;
