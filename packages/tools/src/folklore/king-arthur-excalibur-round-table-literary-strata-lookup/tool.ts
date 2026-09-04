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
          "Arthurian swords and Round Table motifs develop across distinct medieval texts, including Geoffrey, Wace and later romances.",
        reference:
          "Geoffrey of Monmouth; Wace, Roman de Brut; Malory, Le Morte Darthur.",
        limitations:
          "Excalibur and the sword-in-the-stone are not identical in every version; no proven unified historical biography.",
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
      text: "Arthurian swords and Round Table motifs develop across distinct medieval texts, including Geoffrey, Wace and later romances.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/king-arthur-excalibur-round-table-literary-strata-lookup",
  title: "King Arthur Excalibur Round Table Literary Strata Lookup",
  description:
    "Bounded offline reference: Arthurian swords and Round Table motifs develop across distinct medieval texts, including Geoffrey, Wace and later romances. Source: Geoffrey of Monmouth; Wace, Roman de Brut; Malory, Le Morte Darthur. Excalibur and the sword-in-the-stone are not identical in every version; no proven unified historical biography. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
