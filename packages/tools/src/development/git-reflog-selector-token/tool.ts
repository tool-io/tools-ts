import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly reference: string; readonly ordinal: number };
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
    reference: { type: "string", maxLength: 8192 },
    ordinal: { type: "integer" },
  },
  required: ["reference", "ordinal"],
} as const;
/** Compute git reflog selector token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const m = /^([^\s@{}]+)@\{(0|[1-9]\d{0,8})\}(?![\s\S])/.exec(token);
    domain(m);
    return { reference: m[1], ordinal: Number(m[2]) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "HEAD@{3}" },
  output: { reference: "HEAD", ordinal: 3 },
} satisfies ToolExample<Input, Output>;
export const gitReflogSelectorTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/git-reflog-selector-token",
  title: "Git Reflog Selector Token Tool",
  description:
    "Compute git reflog selector token from explicit bounded inputs.",
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
      { id: "reference", label: "Reference", valueType: { type: "string" } },
      { id: "ordinal", label: "Ordinal", valueType: { type: "integer" } },
    ],
  },
});
export const run = gitReflogSelectorTokenTool.execute;
export default gitReflogSelectorTokenTool;
