import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prefix: string;
  readonly opening: string;
  readonly closing: string;
};
export type Output = {
  readonly balance: number;
  readonly minimumBalance: number;
  readonly prematureClose: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefix: { type: "string", maxLength: 8192 },
    opening: { type: "string", maxLength: 8192 },
    closing: { type: "string", maxLength: 8192 },
  },
  required: ["prefix", "opening", "closing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    balance: { type: "integer" },
    minimumBalance: { type: "integer" },
    prematureClose: { type: "boolean" },
  },
  required: ["balance", "minimumBalance", "prematureClose"],
} as const;
/** Inspect literal bracket prefix counts without handling strings, comments or escapes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prefix, opening, closing } = request;
  const compute = (): Output => {
    H.domain(
      [...opening].length === 1 &&
        [...closing].length === 1 &&
        opening !== closing,
    );
    let balance = 0,
      minimumBalance = 0;
    for (const c of prefix) {
      if (c === opening) balance++;
      if (c === closing) balance--;
      minimumBalance = Math.min(minimumBalance, balance);
    }
    return { balance, minimumBalance, prematureClose: minimumBalance < 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prefix: "(()", opening: "(", closing: ")" },
  output: { balance: 1, minimumBalance: 0, prematureClose: false },
} satisfies ToolExample<Input, Output>;
export const bracketDepthPrefixBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/bracket-depth-prefix-balance",
    title: "Bracket Depth Prefix Balance Tool",
    description:
      "Inspect literal bracket prefix counts without handling strings, comments or escapes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefix: { type: "string", maxLength: 8192 },
        opening: { type: "string", maxLength: 8192 },
        closing: { type: "string", maxLength: 8192 },
      },
      required: ["prefix", "opening", "closing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        balance: { type: "integer" },
        minimumBalance: { type: "integer" },
        prematureClose: { type: "boolean" },
      },
      required: ["balance", "minimumBalance", "prematureClose"],
    },
    ports: {
      inputs: [
        {
          id: "prefix",
          label: "Prefix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "opening",
          label: "Opening",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "closing",
          label: "Closing",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "balance", label: "Balance", valueType: { type: "integer" } },
        {
          id: "minimumBalance",
          label: "Minimum Balance",
          valueType: { type: "integer" },
        },
        {
          id: "prematureClose",
          label: "Premature Close",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = bracketDepthPrefixBalanceTool.execute;
export default bracketDepthPrefixBalanceTool;
