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
          "Hadrians Wall began around 122 CE; the Antonine Wall around 142 CE, with subsequent withdrawal and renewed use of the southern frontier.",
        reference:
          "Historic England/Historic Environment Scotland wall histories.",
        limitations:
          "Construction, reoccupation and abandonment were phased; no single exact operational date for every section.",
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
      text: "Hadrians Wall began around 122 CE; the Antonine Wall around 142 CE, with subsequent withdrawal and renewed use of the southern frontier.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/hadrian-wall-versus-antoniine-wall-built-abandoned-timeline",
  title: "Hadrian Wall Versus Antoniine Wall Built Abandoned Timeline",
  description:
    "Bounded offline reference: Hadrians Wall began around 122 CE; the Antonine Wall around 142 CE, with subsequent withdrawal and renewed use of the southern frontier. Source: Historic England/Historic Environment Scotland wall histories. Construction, reoccupation and abandonment were phased; no single exact operational date for every section. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
