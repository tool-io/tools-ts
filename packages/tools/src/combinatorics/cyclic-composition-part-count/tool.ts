import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly total: number; readonly parts: number };
export type Output = { readonly countDecimal: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: { type: "integer", minimum: 1, maximum: 256 },
    parts: { type: "integer", minimum: 1 },
  },
  required: ["total", "parts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { countDecimal: { type: "string", maxLength: 8192 } },
  required: ["countDecimal"],
} as const;
/** Count positive-part compositions of a total into a fixed number of parts modulo cyclic rotation using Burnside’s lemma, including periodic compositions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { total, parts } = request;
  const compute = (): Output => {
    H.integer(total, 1, 256);
    H.integer(parts, 1, total);
    const choose = (n: number, k: number): bigint => {
      let b = 1n;
      for (let i = 1; i <= k; i++) b = (b * BigInt(n - k + i)) / BigInt(i);
      return b;
    };
    const phi = (n: number): number => {
      let a = 0;
      for (let i = 1; i <= n; i++) {
        let x = i,
          y = n;
        while (y) {
          const r = x % y;
          x = y;
          y = r;
        }
        if (x === 1) a++;
      }
      return a;
    };
    let fixedSum = 0n;
    for (let d = 1; d <= parts; d++)
      if (parts % d === 0 && total % d === 0)
        fixedSum += BigInt(phi(d)) * choose(total / d - 1, parts / d - 1);
    return { countDecimal: (fixedSum / BigInt(parts)).toString() };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { total: 6, parts: 3 },
  output: { countDecimal: "4" },
} satisfies ToolExample<Input, Output>;
export const cyclicCompositionPartCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/cyclic-composition-part-count",
    title: "Cyclic Composition Part Count Tool",
    description:
      "Count positive-part compositions of a total into a fixed number of parts modulo cyclic rotation using Burnside’s lemma, including periodic compositions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        total: { type: "integer", minimum: 1, maximum: 256 },
        parts: { type: "integer", minimum: 1 },
      },
      required: ["total", "parts"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { countDecimal: { type: "string", maxLength: 8192 } },
      required: ["countDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "parts",
          label: "Parts",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "countDecimal",
          label: "Count Decimal",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = cyclicCompositionPartCountTool.execute;
export default cyclicCompositionPartCountTool;
