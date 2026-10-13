import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly records: number;
  readonly maximumCollisionProbability: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "records", label: "Records", kind: "number" },
  {
    id: "maximumCollisionProbability",
    label: "Maximum collision probability",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  bounded(i.records, "records", 2, 1000000000);
  if (i.maximumCollisionProbability <= 0 || i.maximumCollisionProbability >= 1)
    simpleError("probability", "Strict 0<p<1.");
  return {
    unionBoundMinimumBits: Math.max(
      0,
      Math.ceil(
        Math.log2(i.records) +
          Math.log2(i.records - 1) -
          1 -
          Math.log2(i.maximumCollisionProbability),
      ),
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { records: 1000, maximumCollisionProbability: 1e-6 },
  output: { result: { unionBoundMinimumBits: 39 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/salt-uniqueness-required-bits-rule-of-thumb",
  title: "Salt Uniqueness Bits Rule of Thumb",
  description:
    "Minimum salt bits under union-bound birthday probability; independent uniform salts assumed, not entropy certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { unionBoundMinimumBits: { type: "number" } },
        required: ["unionBoundMinimumBits"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
