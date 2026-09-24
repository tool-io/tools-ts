import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly hardBreakToken: string;
  readonly softBreakToken: string;
};
export type Output = { readonly kind: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    hardBreakToken: { type: "string", maxLength: 8192 },
    softBreakToken: { type: "string", maxLength: 8192 },
  },
  required: ["token", "hardBreakToken", "softBreakToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { kind: { type: "string", maxLength: 8192 } },
  required: ["kind"],
} as const;
/** Classify caller-defined poetic line-break tokens without reconstructing editorial intent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, hardBreakToken, softBreakToken } = request;
  const compute = (): Output => {
    H.domain(hardBreakToken !== softBreakToken);
    return {
      kind:
        token === hardBreakToken
          ? "hard"
          : token === softBreakToken
            ? "soft"
            : "other",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "\n", hardBreakToken: "\n", softBreakToken: "↩" },
  output: { kind: "hard" },
} satisfies ToolExample<Input, Output>;
export const poetryLineBreakTypeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/poetry-line-break-type-token",
    title: "Poetry Line Break Type Token Tool",
    description:
      "Classify caller-defined poetic line-break tokens without reconstructing editorial intent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        hardBreakToken: { type: "string", maxLength: 8192 },
        softBreakToken: { type: "string", maxLength: 8192 },
      },
      required: ["token", "hardBreakToken", "softBreakToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { kind: { type: "string", maxLength: 8192 } },
      required: ["kind"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "hardBreakToken",
          label: "Hard Break Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "softBreakToken",
          label: "Soft Break Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "kind", label: "Kind", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = poetryLineBreakTypeTokenTool.execute;
export default poetryLineBreakTypeTokenTool;
