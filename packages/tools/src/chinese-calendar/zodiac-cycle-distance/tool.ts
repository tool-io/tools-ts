import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  fromAnimalIndex: number;
  toAnimalIndex: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fromAnimalIndex", label: "From animal index", kind: "integer" },
  { id: "toAnimalIndex", label: "To animal index", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.fromAnimalIndex, 0, 11);
  H.int(i.toAnimalIndex, 0, 11);
  const forward = H.mod(i.toAnimalIndex - i.fromAnimalIndex, 12),
    backward = H.mod(i.fromAnimalIndex - i.toAnimalIndex, 12);
  return H.finish({ forward, backward, shortest: Math.min(forward, backward) });
};
export const example = {
  input: { fromAnimalIndex: 11, toAnimalIndex: 0 },
  output: { result: { forward: 1, backward: 11, shortest: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "chinese-calendar/zodiac-cycle-distance",
  title: "Chinese Animal-Cycle Distance Calculator",
  description:
    "Compute directed and shortest offsets in the conventional Rat=0 through Pig=11 twelve-animal cycle; symbolic calendar positions only.",
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
          backward: { type: "number" },
          forward: { type: "number" },
          shortest: { type: "number" },
        },
        required: ["backward", "forward", "shortest"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
