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
          "Lobby heritage displays can combine attributed production photographs, dates, credits and historical interpretation.",
        reference: "Museum/theatre documentation practice.",
        limitations:
          "Display does not grant image rights or verify every caption; provenance/access requirements remain.",
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
      text: "Lobby heritage displays can combine attributed production photographs, dates, credits and historical interpretation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/lobby-display-heritage-wall-production-photo-boards-lookup",
  title: "Lobby Display Heritage Wall Production Photo Boards Lookup",
  description:
    "Bounded offline reference: Lobby heritage displays can combine attributed production photographs, dates, credits and historical interpretation. Source: Museum/theatre documentation practice. Display does not grant image rights or verify every caption; provenance/access requirements remain. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
