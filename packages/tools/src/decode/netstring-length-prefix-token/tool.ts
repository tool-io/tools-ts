import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly length: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { length: { type: "integer" } },
  required: ["length"],
} as const;
/** Calculate netstring length prefix token from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    H.domain(/^(?:0|[1-9]\d*):(?![\s\S])/.test(token));
    const length = Number(token.slice(0, -1));
    H.integer(length, 0);
    return { length };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "12:" },
  output: { length: 12 },
} satisfies ToolExample<Input, Output>;
export const netstringLengthPrefixTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/netstring-length-prefix-token",
    title: "Netstring Length Prefix Token Tool",
    description:
      "Calculate netstring length prefix token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { length: { type: "integer" } },
      required: ["length"],
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
        { id: "length", label: "Length", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = netstringLengthPrefixTokenTool.execute;
export default netstringLengthPrefixTokenTool;
