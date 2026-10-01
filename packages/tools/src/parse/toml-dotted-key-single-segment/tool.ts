import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  parseJson,
  text,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly segment: string };
export type Output = { readonly key: string; readonly quoted: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { segment: { type: "string", maxLength: 8192 } },
  required: ["segment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    key: { type: "string", maxLength: 8192 },
    quoted: { type: "boolean" },
  },
  required: ["key", "quoted"],
} as const;
/** Compute toml dotted key single segment from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { segment } = input;
  const compute = (): Output => {
    if (/^[A-Za-z0-9_-]+(?![\s\S])/.test(segment))
      return { key: segment, quoted: false };
    domain(/^"(?:[^"\\\r\n]|\\.)*"(?![\s\S])/.test(segment));
    return { key: text(parseJson(segment)), quoted: true };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { segment: '"a.b"' },
  output: { key: "a.b", quoted: true },
} satisfies ToolExample<Input, Output>;
export const tomlDottedKeySingleSegmentTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/toml-dotted-key-single-segment",
  title: "Toml Dotted Key Single Segment Tool",
  description:
    "Compute toml dotted key single segment from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "segment",
        label: "Segment",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "key", label: "Key", valueType: { type: "string" } },
      { id: "quoted", label: "Quoted", valueType: { type: "boolean" } },
    ],
  },
});
export const run = tomlDottedKeySingleSegmentTool.execute;
export default tomlDottedKeySingleSegmentTool;
