import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly value: string; readonly closed: boolean };
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
    value: { type: "string", maxLength: 8192 },
    closed: { type: "boolean" },
  },
  required: ["value", "closed"],
} as const;
/** Compute shell single quoted token boundary from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    domain(token.startsWith("\x27"));
    const end = token.indexOf("\x27", 1);
    return {
      value: end < 0 ? token.slice(1) : token.slice(1, end),
      closed: end === token.length - 1 && end > 0,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "'hello world'" },
  output: { value: "hello world", closed: true },
} satisfies ToolExample<Input, Output>;
export const shellSingleQuotedTokenBoundaryTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/shell-single-quoted-token-boundary",
  title: "Shell Single Quoted Token Boundary Tool",
  description:
    "Compute shell single quoted token boundary from explicit bounded inputs.",
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
      { id: "value", label: "Value", valueType: { type: "string" } },
      { id: "closed", label: "Closed", valueType: { type: "boolean" } },
    ],
  },
});
export const run = shellSingleQuotedTokenBoundaryTool.execute;
export default shellSingleQuotedTokenBoundaryTool;
