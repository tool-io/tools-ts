import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Sapphos surviving poetry depends on quotations, manuscripts, papyri and later discoveries, including Oxyrhynchus material.",
        reference: "Sappho critical editions and papyrological scholarship.",
        limitations:
          "Fragment numbering, provenance and attribution require an exact edition; no complete lost poems reconstructed.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Sapphos surviving poetry depends on quotations, manuscripts, papyri and later discoveries, including Oxyrhynchus material.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/sappho-fragments-papyrus-oxyrhynchus-survival-recovery-note",
  title: "Sappho Fragments Papyrus Oxyrhynchus Survival Recovery Note",
  description:
    "Bounded offline reference: Sapphos surviving poetry depends on quotations, manuscripts, papyri and later discoveries, including Oxyrhynchus material. Source: Sappho critical editions and papyrological scholarship. Fragment numbering, provenance and attribution require an exact edition; no complete lost poems reconstructed. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
