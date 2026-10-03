import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
};
export type Output = {
  readonly defined: boolean;
  readonly denominator: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "integer" },
    b: { type: "integer" },
    c: { type: "integer" },
    d: { type: "integer" },
  },
  required: ["a", "b", "c", "d"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    defined: { type: "boolean" },
    denominator: { type: "string", maxLength: 8192 },
  },
  required: ["defined", "denominator"],
} as const;
/** Calculate yule q zero denominator condition from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { a, b, c, d } = request;
  const compute = (): Output => {
    for (const x of [a, b, c, d]) H.integer(x, 0);
    const denominator = BigInt(a) * BigInt(d) + BigInt(b) * BigInt(c);
    return { defined: denominator !== 0n, denominator: String(denominator) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { a: 2, b: 0, c: 0, d: 3 },
  output: { defined: true, denominator: "6" },
} satisfies ToolExample<Input, Output>;
export const yuleQZeroDenominatorConditionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/yule-q-zero-denominator-condition",
    title: "Yule Q Zero Denominator Condition Tool",
    description:
      "Calculate yule q zero denominator condition from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        a: { type: "integer" },
        b: { type: "integer" },
        c: { type: "integer" },
        d: { type: "integer" },
      },
      required: ["a", "b", "c", "d"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defined: { type: "boolean" },
        denominator: { type: "string", maxLength: 8192 },
      },
      required: ["defined", "denominator"],
    },
    ports: {
      inputs: [
        { id: "a", label: "A", required: true, valueType: { type: "integer" } },
        { id: "b", label: "B", required: true, valueType: { type: "integer" } },
        { id: "c", label: "C", required: true, valueType: { type: "integer" } },
        { id: "d", label: "D", required: true, valueType: { type: "integer" } },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = yuleQZeroDenominatorConditionTool.execute;
export default yuleQZeroDenominatorConditionTool;
