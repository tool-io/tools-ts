import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly propertiesJson: string };
export type Output = { readonly state: string; readonly memberCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { propertiesJson: { type: "string", maxLength: 8192 } },
  required: ["propertiesJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    state: { type: "string", maxLength: 8192 },
    memberCount: { type: "integer" },
  },
  required: ["state", "memberCount"],
} as const;
/** Classify an explicit GeoJSON properties value as null, empty object or nonempty object without conflating absence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { propertiesJson } = request;
  const compute = (): Output => {
    const value = H.parseJson(propertiesJson);
    if (value === null) return { state: "null", memberCount: 0 };
    const p = H.plain(value),
      memberCount = Object.keys(p).length;
    return {
      state: memberCount === 0 ? "empty-object" : "nonempty-object",
      memberCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { propertiesJson: "{}" },
  output: { state: "empty-object", memberCount: 0 },
} satisfies ToolExample<Input, Output>;
export const featurePropertyEmptyStateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/feature-property-empty-state",
    title: "Feature Property Empty State Tool",
    description:
      "Classify an explicit GeoJSON properties value as null, empty object or nonempty object without conflating absence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { propertiesJson: { type: "string", maxLength: 8192 } },
      required: ["propertiesJson"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        state: { type: "string", maxLength: 8192 },
        memberCount: { type: "integer" },
      },
      required: ["state", "memberCount"],
    },
    ports: {
      inputs: [
        {
          id: "propertiesJson",
          label: "Properties Json",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "state", label: "State", valueType: { type: "string" } },
        {
          id: "memberCount",
          label: "Member Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = featurePropertyEmptyStateTool.execute;
export default featurePropertyEmptyStateTool;
