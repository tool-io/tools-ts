import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch43-shared.js";

export type Input = Readonly<{ readonly independentlyAnnotatedTense: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedTense",
    label: "Independently annotated tense",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    defaultAspectDescription: pick(
      input.independentlyAnnotatedTense,
      {
        aorist: "perfective view of the event, not necessarily short duration",
        imperfect: "imperfective past view, not necessarily repeated action",
      },
      "tense",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyAnnotatedTense: "aorist" },
  output: {
    result: {
      defaultAspectDescription:
        "perfective view of the event, not necessarily short duration",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/greek-aorist-vs-imperfect-aspect-classifier",
  title: "Greek Aorist vs Imperfect Aspect Classifier",
  description:
    "Describe conventional aspect contrast of independently annotated Ancient Greek aorist/imperfect, no actual verb-form parsing or contextual temporal guarantee.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
