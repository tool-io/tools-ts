import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly symbol: string; readonly alphabet: string };
export type Output = { readonly recognized: boolean; readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symbol: { type: "string", maxLength: 8192 },
    alphabet: {
      type: "string",
      maxLength: 8192,
      enum: ["base16", "base32", "base32hex", "base64", "base64url"],
    },
  },
  required: ["symbol", "alphabet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recognized: { type: "boolean" }, index: { type: "integer" } },
  required: ["recognized", "index"],
} as const;
/** Inspect exact canonical RFC 4648 alphabet membership; padding is not a data symbol and lowercase aliases are not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { symbol, alphabet } = request;
  const compute = (): Output => {
    H.domain(
      ["base16", "base32", "base32hex", "base64", "base64url"].includes(
        alphabet,
      ),
    );
    H.domain(symbol.length === 1);
    const chars =
      alphabet === "base16"
        ? "0123456789ABCDEF"
        : alphabet === "base32"
          ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
          : alphabet === "base32hex"
            ? "0123456789ABCDEFGHIJKLMNOPQRSTUV"
            : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
              (alphabet === "base64" ? "+/" : "-_");
    const index = chars.indexOf(symbol);
    return { recognized: index >= 0, index };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { symbol: "V", alphabet: "base32hex" },
  output: { recognized: true, index: 31 },
} satisfies ToolExample<Input, Output>;
export const rfc4648AlphabetSymbolIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/rfc4648-alphabet-symbol-index",
    title: "RFC 4648 Alphabet Symbol Index Tool",
    description:
      "Inspect exact canonical RFC 4648 alphabet membership; padding is not a data symbol and lowercase aliases are not inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        symbol: { type: "string", maxLength: 8192 },
        alphabet: {
          type: "string",
          maxLength: 8192,
          enum: ["base16", "base32", "base32hex", "base64", "base64url"],
        },
      },
      required: ["symbol", "alphabet"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "boolean" },
        index: { type: "integer" },
      },
      required: ["recognized", "index"],
    },
    ports: {
      inputs: [
        {
          id: "symbol",
          label: "Symbol",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "alphabet",
          label: "Alphabet",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = rfc4648AlphabetSymbolIndexTool.execute;
export default rfc4648AlphabetSymbolIndexTool;
