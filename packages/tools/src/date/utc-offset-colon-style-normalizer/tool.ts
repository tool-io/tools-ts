import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly offset: string };
export type Output = { readonly colon: string; readonly compact: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "string", maxLength: 8192 } },
  required: ["offset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    colon: { type: "string", maxLength: 8192 },
    compact: { type: "string", maxLength: 8192 },
  },
  required: ["colon", "compact"],
} as const;
/** Compute utc offset colon style normalizer from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { offset } = input;
  const compute = (): Output => {
    const m = /^([+-])(\d{2}):?(\d{2})(?![\s\S])/.exec(offset);
    domain(m && Number(m[2]) <= 23 && Number(m[3]) <= 59);
    return { colon: m[1] + m[2] + ":" + m[3], compact: m[1] + m[2] + m[3] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { offset: "+0230" },
  output: { colon: "+02:30", compact: "+0230" },
} satisfies ToolExample<Input, Output>;
export const utcOffsetColonStyleNormalizerTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/utc-offset-colon-style-normalizer",
  title: "UTC Offset Colon Style Normalizer Tool",
  description:
    "Compute utc offset colon style normalizer from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "offset",
        label: "Offset",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "colon", label: "Colon", valueType: { type: "string" } },
      { id: "compact", label: "Compact", valueType: { type: "string" } },
    ],
  },
});
export const run = utcOffsetColonStyleNormalizerTool.execute;
export default utcOffsetColonStyleNormalizerTool;
