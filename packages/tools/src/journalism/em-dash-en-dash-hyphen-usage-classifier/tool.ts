import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, range } from "../batch52-shared.js";
export type Input = Readonly<{ readonly declaredUse: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "declaredUse", label: "Declared use", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.declaredUse,
      {
        "parenthetical-break": "em dash",
        "inclusive-range": "en dash",
        "compound-word": "hyphen",
      },
      "declaredUse",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { declaredUse: "inclusive-range" },
  output: { result: { reference: "en dash" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/em-dash-en-dash-hyphen-usage-classifier",
  title: "Em Dash En Dash Hyphen Usage Classifier",
  description:
    "Bounded common dash-use mapping from caller declared function, not grammatical text inference or universal stylebook rule.",
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
