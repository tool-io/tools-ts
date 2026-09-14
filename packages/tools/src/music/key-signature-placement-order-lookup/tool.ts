import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly accidental: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "accidental", label: "Accidental", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.accidental,
      {
        sharp: ["F", "C", "G", "D", "A", "E", "B"],
        flat: ["B", "E", "A", "D", "G", "C", "F"],
      },
      "accidental",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { accidental: "sharp" },
  output: { result: { reference: ["F", "C", "G", "D", "A", "E", "B"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/key-signature-placement-order-lookup",
  title: "Key Signature Placement Order Lookup",
  description:
    "Conventional pitch-class order for seven sharp/flat key signatures; staff octaves clef-specific.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
