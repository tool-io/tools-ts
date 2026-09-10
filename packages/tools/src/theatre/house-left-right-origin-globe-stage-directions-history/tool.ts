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
          "House left/right use the audience viewpoint; stage left/right conventionally use the performers viewpoint facing the audience.",
        reference: "Stage-direction terminology and theatre history.",
        limitations:
          "These conventions are not securely attributed to one Globe invention; verify actual local direction policy.",
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
      text: "House left/right use the audience viewpoint; stage left/right conventionally use the performers viewpoint facing the audience.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/house-left-right-origin-globe-stage-directions-history",
  title: "House Left Right Stage Direction Origin Shakespearean Globe History",
  description:
    "Bounded offline reference: House left/right use the audience viewpoint; stage left/right conventionally use the performers viewpoint facing the audience. Source: Stage-direction terminology and theatre history. These conventions are not securely attributed to one Globe invention; verify actual local direction policy. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
