import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string; readonly prefix: string };
export type Output = { readonly state: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    prefix: { type: "string", maxLength: 8192 },
  },
  required: ["token", "prefix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { state: { type: "integer" } },
  required: ["state"],
} as const;
/** Read a positive decimal print-state number after an exact caller-supplied prefix. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, prefix } = request;
  const compute = (): Output => {
    H.domain(prefix.length > 0 && token.startsWith(prefix));
    const suffix = token.slice(prefix.length);
    H.domain(/^[1-9]\d*(?![\s\S])/.test(suffix));
    const state = Number(suffix);
    H.integer(state, 1);
    return { state };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "state 3", prefix: "state " },
  output: { state: 3 },
} satisfies ToolExample<Input, Output>;
export const printStateNumberTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/print-state-number-token",
    title: "Print State Number Token Tool",
    description:
      "Read a positive decimal print-state number after an exact caller-supplied prefix.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        prefix: { type: "string", maxLength: 8192 },
      },
      required: ["token", "prefix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { state: { type: "integer" } },
      required: ["state"],
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
          id: "prefix",
          label: "Prefix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "state", label: "State", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = printStateNumberTokenTool.execute;
export default printStateNumberTokenTool;
