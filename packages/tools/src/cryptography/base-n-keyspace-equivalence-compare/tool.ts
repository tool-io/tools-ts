import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly alphabetA: number;
  readonly lengthA: number;
  readonly alphabetB: number;
  readonly lengthB: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "alphabetA", label: "Alphabet a", kind: "number" },
  { id: "lengthA", label: "Length a", kind: "number" },
  { id: "alphabetB", label: "Alphabet b", kind: "number" },
  { id: "lengthB", label: "Length b", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  bounded(i.alphabetA, "alphabet", 2, 1000000);
  bounded(i.alphabetB, "alphabet", 2, 1000000);
  bounded(i.lengthA, "length", 0, 1000000);
  bounded(i.lengthB, "length", 0, 1000000);
  return {
    signedBitsDifference:
      i.lengthA * Math.log2(i.alphabetA) - i.lengthB * Math.log2(i.alphabetB),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { alphabetA: 16, lengthA: 2, alphabetB: 2, lengthB: 8 },
  output: { result: { signedBitsDifference: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/base-n-keyspace-equivalence-compare",
  title: "Base-N Keyspace Equivalence Compare",
  description:
    "Signed log2 keyspace difference between independent uniform alphabet models; not actual password entropy.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { signedBitsDifference: { type: "number" } },
        required: ["signedBitsDifference"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
