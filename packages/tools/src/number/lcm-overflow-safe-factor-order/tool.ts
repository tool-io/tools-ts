import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: string; readonly second: string };
export type Output = { readonly gcd: string; readonly lcm: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "string", maxLength: 8192 },
    second: { type: "string", maxLength: 8192 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gcd: { type: "string", maxLength: 8192 },
    lcm: { type: "string", maxLength: 8192 },
  },
  required: ["gcd", "lcm"],
} as const;
/** Calculate lcm overflow safe factor order from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    let a = H.decimal(first),
      b = H.decimal(second);
    H.domain(a >= 0n && b >= 0n);
    const x = a,
      y = b;
    while (b) {
      const r = a % b;
      a = b;
      b = r;
    }
    return { gcd: String(a), lcm: String(a === 0n ? 0n : (x / a) * y) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: "12", second: "18" },
  output: { gcd: "6", lcm: "36" },
} satisfies ToolExample<Input, Output>;
export const lcmOverflowSafeFactorOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/lcm-overflow-safe-factor-order",
    title: "Lcm Overflow Safe Factor Order Tool",
    description:
      "Calculate lcm overflow safe factor order from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "string", maxLength: 8192 },
        second: { type: "string", maxLength: 8192 },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gcd: { type: "string", maxLength: 8192 },
        lcm: { type: "string", maxLength: 8192 },
      },
      required: ["gcd", "lcm"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "gcd", label: "Gcd", valueType: { type: "string" } },
        { id: "lcm", label: "Lcm", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = lcmOverflowSafeFactorOrderTool.execute;
export default lcmOverflowSafeFactorOrderTool;
