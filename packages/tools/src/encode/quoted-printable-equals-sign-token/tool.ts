import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly symbol: string };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { symbol: { type: "string", maxLength: 8192 } },
  required: ["symbol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Compute quoted printable equals sign token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { symbol } = input;
  const compute = (): Output => {
    domain(symbol === "=");
    return { token: "=3D" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { symbol: "=" },
  output: { token: "=3D" },
} satisfies ToolExample<Input, Output>;
export const quotedPrintableEqualsSignTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "encode/quoted-printable-equals-sign-token",
  title: "Quoted Printable Equals Sign Token Tool",
  description:
    "Compute quoted printable equals sign token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "symbol",
        label: "Symbol",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
  },
});
export const run = quotedPrintableEqualsSignTokenTool.execute;
export default quotedPrintableEqualsSignTokenTool;
