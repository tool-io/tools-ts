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
          "RioPrinciple15and the Cartagena Protocol articulate precaution in distinct environmental/biosafety instruments and contexts.",
        reference: "RioDeclaration1992Principle15; Cartagena Protocol 2000.",
        limitations:
          "Not identical legal tests or universal permission to prohibit technologies; jurisdiction-specific advice remains external.",
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
      text: "RioPrinciple15and the Cartagena Protocol articulate precaution in distinct environmental/biosafety instruments and contexts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/precautionary-principle-rio-cartagena-definition-versions",
  title: "Precautionary Principle Rio Cartagena Definition Versions",
  description:
    "Bounded offline reference: RioPrinciple15and the Cartagena Protocol articulate precaution in distinct environmental/biosafety instruments and contexts. Source: RioDeclaration1992Principle15; Cartagena Protocol 2000. Not identical legal tests or universal permission to prohibit technologies; jurisdiction-specific advice remains external. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
