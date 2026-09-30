import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { calculate as parsePointer } from "../../json/json-pointer-terminal-empty-segment/tool.js";
export type Input = { readonly pointer: string };
export type Output = {
  readonly root: boolean;
  readonly finalTokenEmpty: boolean;
  readonly tokenCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pointer: { type: "string", maxLength: 8192 } },
  required: ["pointer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    root: { type: "boolean" },
    finalTokenEmpty: { type: "boolean" },
    tokenCount: { type: "integer" },
  },
  required: ["root", "finalTokenEmpty", "tokenCount"],
} as const;
/** Distinguish root from a terminal empty token using the existing RFC 6901 pointer validator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pointer } = request;
  const compute = (): Output => {
    const p = parsePointer({ pointer });
    return {
      root: pointer === "",
      finalTokenEmpty: p.terminalEmpty,
      tokenCount: p.tokenCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pointer: "/a/" },
  output: { root: false, finalTokenEmpty: true, tokenCount: 2 },
} satisfies ToolExample<Input, Output>;
export const jsonPointerFinalTokenIsEmptyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-pointer-final-token-is-empty",
    title: "JSON Pointer Final Token Is Empty Tool",
    description:
      "Distinguish root from a terminal empty token using the existing RFC 6901 pointer validator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { pointer: { type: "string", maxLength: 8192 } },
      required: ["pointer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        root: { type: "boolean" },
        finalTokenEmpty: { type: "boolean" },
        tokenCount: { type: "integer" },
      },
      required: ["root", "finalTokenEmpty", "tokenCount"],
    },
    ports: {
      inputs: [
        {
          id: "pointer",
          label: "Pointer",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "root", label: "Root", valueType: { type: "boolean" } },
        {
          id: "finalTokenEmpty",
          label: "Final Token Empty",
          valueType: { type: "boolean" },
        },
        {
          id: "tokenCount",
          label: "Token Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = jsonPointerFinalTokenIsEmptyTool.execute;
export default jsonPointerFinalTokenIsEmptyTool;
