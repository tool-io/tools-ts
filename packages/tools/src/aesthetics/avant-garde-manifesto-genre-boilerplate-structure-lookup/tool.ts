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
          "Avant-garde manifestos commonly declare a program, oppose established conventions and position a collective or movement.",
        reference:
          "Historical manifesto collections; Marinetti's 1909 manifesto.",
        limitations:
          "Genre description does not endorse political violence or guarantee every manifesto follows one template.",
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
      text: "Avant-garde manifestos commonly declare a program, oppose established conventions and position a collective or movement.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/avant-garde-manifesto-genre-boilerplate-structure-lookup",
  title: "Avant Garde Manifesto Genre Boilerplate Structure Lookup",
  description:
    "Bounded offline reference: Avant-garde manifestos commonly declare a program, oppose established conventions and position a collective or movement. Source: Historical manifesto collections; Marinetti's 1909 manifesto. Genre description does not endorse political violence or guarantee every manifesto follows one template. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
