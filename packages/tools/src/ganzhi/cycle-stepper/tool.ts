import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  stemIndex: number;
  branchIndex: number;
  steps: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "stemIndex", label: "Stem index", kind: "integer" },
  { id: "branchIndex", label: "Branch index", kind: "integer" },
  { id: "steps", label: "Steps", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.stemIndex, 0, 9);
  H.int(i.branchIndex, 0, 11);
  H.check(i.stemIndex % 2 === i.branchIndex % 2);
  const index = Array.from({ length: 60 }, (_, j) => j).find(
    (j) => j % 10 === i.stemIndex && j % 12 === i.branchIndex,
  )!;
  H.int(i.steps, -1000000, 1000000);
  const j = H.mod(index + i.steps, 60);
  return H.finish({ ordinal: j + 1, stemIndex: j % 10, branchIndex: j % 12 });
};
export const example = {
  input: { stemIndex: 0, branchIndex: 0, steps: -1 },
  output: { result: { ordinal: 60, stemIndex: 9, branchIndex: 11 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ganzhi/cycle-stepper",
  title: "Sexagenary Cycle Step Calculator",
  description:
    "Advance a valid sexagenary pair by signed whole cycle steps, preserving stem/branch parity and the one-based ordinal.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          branchIndex: { type: "number" },
          ordinal: { type: "number" },
          stemIndex: { type: "number" },
        },
        required: ["branchIndex", "ordinal", "stemIndex"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
