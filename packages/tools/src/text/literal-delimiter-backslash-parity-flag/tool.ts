import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly prefix: string };
export type Output = {
  readonly backslashes: number;
  readonly escaped: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { prefix: { type: "string", maxLength: 8192 } },
  required: ["prefix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    backslashes: { type: "integer" },
    escaped: { type: "boolean" },
  },
  required: ["backslashes", "escaped"],
} as const;
/** Compute literal delimiter backslash parity flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { prefix } = input;
  const compute = (): Output => {
    const backslashes = (prefix.match(/\\*(?![\s\S])/) ?? [""])[0].length;
    return { backslashes, escaped: backslashes % 2 === 1 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { prefix: "abc\\\\\\" },
  output: { backslashes: 3, escaped: true },
} satisfies ToolExample<Input, Output>;
export const literalDelimiterBackslashParityFlagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/literal-delimiter-backslash-parity-flag",
  title: "Literal Delimiter Backslash Parity Flag Tool",
  description:
    "Compute literal delimiter backslash parity flag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "prefix",
        label: "Prefix",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "backslashes",
        label: "Backslashes",
        valueType: { type: "integer" },
      },
      { id: "escaped", label: "Escaped", valueType: { type: "boolean" } },
    ],
  },
});
export const run = literalDelimiterBackslashParityFlagTool.execute;
export default literalDelimiterBackslashParityFlagTool;
