import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "The well-made play, pi\u00e8ce bien faite, uses carefully arranged exposition, complications and revelations in particular nineteenth-century traditions.",
        reference: "Scribe/Sardou dramatic history.",
        limitations:
          "The title spelling is corrected; not a universal necessary structure or quality test.",
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
      text: "The well-made play, pi\u00e8ce bien faite, uses carefully arranged exposition, complications and revelations in particular nineteenth-century traditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/well-made-play-piece-biene-climax-structure-lookup",
  title: "Well Made Play Piece Biene Climax Structure Lookup",
  description:
    "Bounded offline reference: The well-made play, pi\u00e8ce bien faite, uses carefully arranged exposition, complications and revelations in particular nineteenth-century traditions. Source: Scribe/Sardou dramatic history. The title spelling is corrected; not a universal necessary structure or quality test. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
