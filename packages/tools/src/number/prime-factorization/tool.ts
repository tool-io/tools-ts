import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { value: 84 },
  output: { factors: [2, 2, 3, 7] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "number/prime-factorization",
  title: "Prime Factorization Calculator",
  description:
    "Factor a positive integer at most one trillion by trial division; output lists prime factors with multiplicity. One has no prime factors.",
  inputs: [
    {
      id: "value",
      kind: "integer",
      label: "value",
      minimum: 1,
      maximum: 1000000000000,
    },
  ],
  outputs: [{ id: "factors", kind: "numberList", label: "factors" }],
  calculate: (input) => {
    let value = input.value as number;
    const factors: number[] = [];
    for (
      let divisor = 2;
      divisor * divisor <= value;
      divisor += divisor === 2 ? 1 : 2
    ) {
      while (value % divisor === 0) {
        factors.push(divisor);
        value /= divisor;
      }
    }
    if (value > 1) factors.push(value);
    return { factors };
  },
});
export type PrimeFactorizationInput = Readonly<typeof example.input>;
export type PrimeFactorizationOutput = Readonly<typeof example.output>;
export const primeFactorizationTool = tool;
export const runPrimeFactorization = tool.execute;
export default tool;
