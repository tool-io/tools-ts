import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly propertiesJson: string; readonly key: string };
export type Output = {
  readonly propertiesJson: string;
  readonly removed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    propertiesJson: { type: "string", maxLength: 8192 },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["propertiesJson", "key"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    propertiesJson: { type: "string", maxLength: 8192 },
    removed: { type: "boolean" },
  },
  required: ["propertiesJson", "removed"],
} as const;
/** Calculate feature properties single key removal from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { propertiesJson, key } = request;
  const compute = (): Output => {
    const p = H.plain(H.parseJson(propertiesJson)),
      removed = Object.hasOwn(p, key);
    return {
      propertiesJson: JSON.stringify(
        Object.fromEntries(Object.entries(p).filter(([k]) => k !== key)),
      ),
      removed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { propertiesJson: '{"a":1,"b":2}', key: "a" },
  output: { propertiesJson: '{"b":2}', removed: true },
} satisfies ToolExample<Input, Output>;
export const featurePropertiesSingleKeyRemovalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/feature-properties-single-key-removal",
    title: "Feature Properties Single Key Removal Tool",
    description:
      "Calculate feature properties single key removal from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        propertiesJson: { type: "string", maxLength: 8192 },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["propertiesJson", "key"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        propertiesJson: { type: "string", maxLength: 8192 },
        removed: { type: "boolean" },
      },
      required: ["propertiesJson", "removed"],
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
          id: "key",
          label: "Key",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "propertiesJson",
          label: "Properties Json",
          valueType: { type: "string" },
        },
        { id: "removed", label: "Removed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = featurePropertiesSingleKeyRemovalTool.execute;
export default featurePropertiesSingleKeyRemovalTool;
