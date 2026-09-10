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
    enum: [
      "materialPriorities",
      "postmaterialPriorities",
      "classification",
      "limitations",
    ],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        materialPriorities:
          "The conventional material pair concerns maintaining order and fighting rising prices.",
        postmaterialPriorities:
          "The conventional postmaterial pair concerns more say in government decisions and protecting freedom of speech.",
        classification:
          "Two material priorities indicate materialist, two postmaterial priorities postmaterialist, and one of each mixed, under this declared instrument.",
        limitations:
          "Different versions and response options require independent questionnaire verification.",
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
  input: { topic: "materialPriorities" },
  output: {
    result: {
      text: "The conventional material pair concerns maintaining order and fighting rising prices.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/postmaterialism-four-item-index",
  title: "Four-Item Postmaterialism Index Calculator",
  description:
    "Bounded offline reference: Ingleharts four-item postmaterialism index classifies independently ranked priority pairs within the stated survey version. Source: Inglehart, The Silent Revolution 1977; World Values Survey questionnaires. Order/wording and context matter; no automatic coding from free text or diagnosis of personal worth. Only explicit topic keys supported: materialPriorities, postmaterialPriorities, classification, limitations. No complete external corpus, live data or personal assessment implied.",
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
