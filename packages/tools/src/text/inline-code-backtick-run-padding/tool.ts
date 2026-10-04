import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly code: string };
export type Output = { readonly padded: string; readonly required: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { code: { type: "string", maxLength: 8192 } },
  required: ["code"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    padded: { type: "string", maxLength: 8192 },
    required: { type: "boolean" },
  },
  required: ["padded", "required"],
} as const;
/** Compute inline code backtick run padding from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { code } = input;
  const compute = (): Output => {
    const required =
      code.startsWith("`") ||
      code.endsWith("`") ||
      (code.startsWith(" ") &&
        code.endsWith(" ") &&
        !/^ +(?![\s\S])/.test(code));
    return { padded: required ? " " + code + " " : code, required };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { code: "`x`" },
  output: { padded: " `x` ", required: true },
} satisfies ToolExample<Input, Output>;
export const inlineCodeBacktickRunPaddingTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/inline-code-backtick-run-padding",
  title: "Inline Code Backtick Run Padding Tool",
  description:
    "Compute inline code backtick run padding from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "code",
        label: "Code",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "padded", label: "Padded", valueType: { type: "string" } },
      { id: "required", label: "Required", valueType: { type: "boolean" } },
    ],
  },
});
export const run = inlineCodeBacktickRunPaddingTool.execute;
export default inlineCodeBacktickRunPaddingTool;
