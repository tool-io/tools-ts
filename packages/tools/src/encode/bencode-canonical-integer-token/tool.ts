import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly integer: string };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { integer: { type: "string", maxLength: 8192 } },
  required: ["integer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Calculate bencode canonical integer token from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { integer } = input;
  const compute = (): Output => {
    H.domain(/^(?:0|-?[1-9]\d*)(?![\s\S])/.test(integer));
    return { token: "i" + integer + "e" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { integer: "-42" },
  output: { token: "i-42e" },
} satisfies ToolExample<Input, Output>;
export const bencodeCanonicalIntegerTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/bencode-canonical-integer-token",
    title: "Bencode Canonical Integer Token Tool",
    description:
      "Calculate bencode canonical integer token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { integer: { type: "string", maxLength: 8192 } },
      required: ["integer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "integer",
          label: "Integer",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = bencodeCanonicalIntegerTokenTool.execute;
export default bencodeCanonicalIntegerTokenTool;
