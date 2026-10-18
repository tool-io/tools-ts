import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, unique } from "../batch52-shared.js";
export type Input = Readonly<{ readonly mark: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "mark", label: "Mark", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
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
export const calculate = (i: Input) => {
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

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "string" } },
        required: ["reference"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
