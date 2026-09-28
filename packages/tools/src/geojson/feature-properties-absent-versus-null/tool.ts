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
export type Input = { readonly featureJson: string };
export type Output = { readonly state: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { featureJson: { type: "string", maxLength: 8192 } },
  required: ["featureJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { state: { type: "string", maxLength: 8192 } },
  required: ["state"],
} as const;
/** Compute feature properties absent versus null from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { featureJson } = input;
  const compute = (): Output => {
    const f = plain(parseJson(featureJson));
    domain(f.type === "Feature");
    if (!Object.hasOwn(f, "properties")) return { state: "absent" };
    if (f.properties === null) return { state: "null" };
    plain(f.properties);
    return { state: "object" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { featureJson: '{"type":"Feature","geometry":null}' },
  output: { state: "absent" },
} satisfies ToolExample<Input, Output>;
export const featurePropertiesAbsentVersusNullTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geojson/feature-properties-absent-versus-null",
  title: "Feature Properties Absent Versus Null Tool",
  description:
    "Compute feature properties absent versus null from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "featureJson",
        label: "Feature Json",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [{ id: "state", label: "State", valueType: { type: "string" } }],
  },
});
export const run = featurePropertiesAbsentVersusNullTool.execute;
export default featurePropertiesAbsentVersusNullTool;
