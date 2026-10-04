import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly canonical: string; readonly saturated: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canonical: { type: "string", maxLength: 8192 },
    saturated: { type: "integer" },
  },
  required: ["canonical", "saturated"],
} as const;
/** Compute cache directive delta seconds boundary from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    domain(/^\d{1,128}(?![\s\S])/.test(token));
    const value = BigInt(token);
    return {
      canonical: value.toString(),
      saturated: Number(value > 2147483648n ? 2147483648n : value),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "99999999999999999999" },
  output: { canonical: "99999999999999999999", saturated: 2147483648 },
} satisfies ToolExample<Input, Output>;
export const cacheDirectiveDeltaSecondsBoundaryTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/cache-directive-delta-seconds-boundary",
  title: "Cache Directive Delta Seconds Boundary Tool",
  description:
    "Compute cache directive delta seconds boundary from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "token",
        label: "Token",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "canonical", label: "Canonical", valueType: { type: "string" } },
      { id: "saturated", label: "Saturated", valueType: { type: "integer" } },
    ],
  },
});
export const run = cacheDirectiveDeltaSecondsBoundaryTool.execute;
export default cacheDirectiveDeltaSecondsBoundaryTool;
