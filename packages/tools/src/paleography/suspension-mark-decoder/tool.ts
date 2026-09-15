import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, unique } from "../batch52-shared.js";
export type Input = Readonly<{ readonly mark: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mark", label: "Mark", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.mark,
      {
        tilde:
          "Often abbreviational, potentially omitted letters; expansion is context-dependent.",
        macron:
          "Overbar may mark abbreviation, nasal omission or numeral; context required.",
        curly:
          "Curved abbreviation signs vary by script and period; no unique universal expansion.",
      },
      "mark",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { mark: "macron" },
  output: {
    result: {
      reference:
        "Overbar may mark abbreviation, nasal omission or numeral; context required.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleography/suspension-mark-decoder",
  title: "Suspension Mark Type Decoder (tilde/macron/curly)",
  description:
    "Bounded abbreviation-sign notes only, no automatic manuscript transcription.",
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
