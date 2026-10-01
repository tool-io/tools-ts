import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly octet: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer" } },
  required: ["octet"],
} as const;
/** Calculate shell ansi c hex escape from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    H.domain(/^\\x[0-9a-fA-F]{1,2}(?![\s\S])/.test(token));
    return { octet: parseInt(token.slice(2), 16) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "\\x41" },
  output: { octet: 65 },
} satisfies ToolExample<Input, Output>;
export const shellAnsiCHexEscapeTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "parse/shell-ansi-c-hex-escape",
      title: "Shell Ansi C Hex Escape Tool",
      description:
        "Calculate shell ansi c hex escape from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { octet: { type: "integer" } },
        required: ["octet"],
      },
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
          { id: "octet", label: "Octet", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  },
);
export const run = shellAnsiCHexEscapeTool.execute;
export default shellAnsiCHexEscapeTool;
