import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly pointer: string };
export type Output = {
  readonly terminalEmpty: boolean;
  readonly tokenCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pointer: { type: "string", maxLength: 8192 } },
  required: ["pointer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    terminalEmpty: { type: "boolean" },
    tokenCount: { type: "integer" },
  },
  required: ["terminalEmpty", "tokenCount"],
} as const;
/** Compute json pointer terminal empty segment from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { pointer } = input;
  const compute = (): Output => {
    domain(pointer === "" || /^\/(?:[^~]|~[01])*(?![\s\S])/.test(pointer));
    return {
      terminalEmpty: pointer.endsWith("/"),
      tokenCount: pointer === "" ? 0 : pointer.split("/").length - 1,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { pointer: "/a/" },
  output: { terminalEmpty: true, tokenCount: 2 },
} satisfies ToolExample<Input, Output>;
export const jsonPointerTerminalEmptySegmentTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-pointer-terminal-empty-segment",
  title: "JSON Pointer Terminal Empty Segment Tool",
  description:
    "Compute json pointer terminal empty segment from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "pointer",
        label: "Pointer",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "terminalEmpty",
        label: "Terminal Empty",
        valueType: { type: "boolean" },
      },
      {
        id: "tokenCount",
        label: "Token Count",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = jsonPointerTerminalEmptySegmentTool.execute;
export default jsonPointerTerminalEmptySegmentTool;
