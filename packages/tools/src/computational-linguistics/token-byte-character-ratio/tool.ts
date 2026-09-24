import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { utf8Encode } from "../../core/encoding.js";
export type Input = { readonly token: string };
export type Output = {
  readonly utf8Bytes: number;
  readonly codePoints: number;
  readonly ratio: number;
  readonly defined: boolean;
};
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
    utf8Bytes: { type: "integer" },
    codePoints: { type: "integer" },
    ratio: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["utf8Bytes", "codePoints", "ratio", "defined"],
} as const;
/** Compare portable UTF-8 bytes to code points; isolated surrogates use replacement encoding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    return {
      utf8Bytes: utf8Encode(token).length,
      codePoints: [...token].length,
      ratio: token.length ? utf8Encode(token).length / [...token].length : 0,
      defined: token.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "Aé🚀" },
  output: {
    utf8Bytes: 7,
    codePoints: 3,
    ratio: 2.3333333333333335,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const tokenByteCharacterRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-linguistics/token-byte-character-ratio",
    title: "Token Byte Character Ratio Tool",
    description:
      "Compare portable UTF-8 bytes to code points; isolated surrogates use replacement encoding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        utf8Bytes: { type: "integer" },
        codePoints: { type: "integer" },
        ratio: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["utf8Bytes", "codePoints", "ratio", "defined"],
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
        { id: "utf8Bytes", label: "Utf8Bytes", valueType: { type: "integer" } },
        {
          id: "codePoints",
          label: "Code Points",
          valueType: { type: "integer" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = tokenByteCharacterRatioTool.execute;
export default tokenByteCharacterRatioTool;
