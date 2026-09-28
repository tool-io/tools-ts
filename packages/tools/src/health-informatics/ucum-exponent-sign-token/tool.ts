import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly exponent: number;
  readonly explicitPlus: boolean;
  readonly negative: boolean;
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
    exponent: { type: "integer" },
    explicitPlus: { type: "boolean" },
    negative: { type: "boolean" },
  },
  required: ["exponent", "explicitPlus", "negative"],
} as const;
/** Inspect a supplied signed integer exponent spelling independently of a complete UCUM unit expression. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match = /^([+-]?)(\d+)(?![\s\S])/.exec(token);
    H.domain(match, "token");
    const exponent = Number(token);
    H.integer(exponent, -Number.MAX_SAFE_INTEGER);
    return {
      exponent,
      explicitPlus: match[1] === "+",
      negative: match[1] === "-",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "-2" },
  output: { exponent: -2, explicitPlus: false, negative: true },
} satisfies ToolExample<Input, Output>;
export const ucumExponentSignTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/ucum-exponent-sign-token",
    title: "UCUM Exponent Sign Token Tool",
    description:
      "Inspect a supplied signed integer exponent spelling independently of a complete UCUM unit expression.",
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
        exponent: { type: "integer" },
        explicitPlus: { type: "boolean" },
        negative: { type: "boolean" },
      },
      required: ["exponent", "explicitPlus", "negative"],
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
        { id: "exponent", label: "Exponent", valueType: { type: "integer" } },
        {
          id: "explicitPlus",
          label: "Explicit Plus",
          valueType: { type: "boolean" },
        },
        { id: "negative", label: "Negative", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = ucumExponentSignTokenTool.execute;
export default ucumExponentSignTokenTool;
