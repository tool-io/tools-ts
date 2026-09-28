import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly propertiesJson: string; readonly key: string };
export type Output = {
  readonly propertiesJson: string;
  readonly existed: boolean;
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
    existed: { type: "boolean" },
  },
  required: ["propertiesJson", "existed"],
} as const;
/** Calculate feature property json null replacement from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { propertiesJson, key } = request;
  const compute = (): Output => {
    const p = H.plain(H.parseJson(propertiesJson)),
      existed = Object.hasOwn(p, key);
    return {
      propertiesJson: JSON.stringify(
        Object.fromEntries([
          ...Object.entries(p).filter(([k]) => k !== key),
          [key, null],
        ]),
      ),
      existed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { propertiesJson: '{"a":1,"b":2}', key: "a" },
  output: { propertiesJson: '{"b":2,"a":null}', existed: true },
} satisfies ToolExample<Input, Output>;
export const featurePropertyJsonNullReplacementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/feature-property-json-null-replacement",
    title: "Feature Property JSON Null Replacement Tool",
    description:
      "Calculate feature property json null replacement from explicit caller-supplied inputs.",
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
        existed: { type: "boolean" },
      },
      required: ["propertiesJson", "existed"],
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
        { id: "existed", label: "Existed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = featurePropertyJsonNullReplacementTool.execute;
export default featurePropertyJsonNullReplacementTool;
