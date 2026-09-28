import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  parseJson,
  plain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly propertiesJson: string;
  readonly oldKey: string;
  readonly newKey: string;
  readonly overwrite: boolean;
};
export type Output = {
  readonly propertiesJson: string;
  readonly renamed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    propertiesJson: { type: "string", maxLength: 8192 },
    oldKey: { type: "string", maxLength: 8192 },
    newKey: { type: "string", maxLength: 8192 },
    overwrite: { type: "boolean" },
  },
  required: ["propertiesJson", "oldKey", "newKey", "overwrite"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    propertiesJson: { type: "string", maxLength: 8192 },
    renamed: { type: "boolean" },
  },
  required: ["propertiesJson", "renamed"],
} as const;
/** Compute feature property key collision policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { propertiesJson, oldKey, newKey, overwrite } = input;
  const compute = (): Output => {
    const p = plain(parseJson(propertiesJson));
    domain(Object.hasOwn(p, oldKey));
    domain(overwrite || oldKey === newKey || !Object.hasOwn(p, newKey));
    const result = Object.fromEntries(
      Object.entries(p).filter(([k]) => k !== oldKey),
    );
    Object.defineProperty(result, newKey, {
      value: p[oldKey],
      enumerable: true,
      writable: true,
      configurable: true,
    });
    return {
      propertiesJson: JSON.stringify(result),
      renamed: oldKey !== newKey,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    propertiesJson: '{"a":1,"b":2}',
    oldKey: "a",
    newKey: "b",
    overwrite: true,
  },
  output: { propertiesJson: '{"b":1}', renamed: true },
} satisfies ToolExample<Input, Output>;
export const featurePropertyKeyCollisionPolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geojson/feature-property-key-collision-policy",
  title: "Feature Property Key Collision Policy Tool",
  description:
    "Compute feature property key collision policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "propertiesJson",
        label: "Properties Json",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "oldKey",
        label: "Old Key",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "newKey",
        label: "New Key",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "overwrite",
        label: "Overwrite",
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
      { id: "renamed", label: "Renamed", valueType: { type: "boolean" } },
    ],
  },
});
export const run = featurePropertyKeyCollisionPolicyTool.execute;
export default featurePropertyKeyCollisionPolicyTool;
