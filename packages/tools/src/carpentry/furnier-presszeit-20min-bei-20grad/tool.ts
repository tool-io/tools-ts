import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch49-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return {
    text: pick(
      input.topic,
      {
        namedCondition:
          "Title-specific20minutes at20\u00b0C is a named example condition, not a universal veneer press cycle.",
        limitations:
          "Actual adhesive product, substrates, pressure, humidity and approved cure cycle govern release, not an invented time-temperature law.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "namedCondition" },
  output: {
    result: {
      text: "Title-specific20minutes at20\u00b0C is a named example condition, not a universal veneer press cycle.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/furnier-presszeit-20min-bei-20grad",
  title: "Furnier Presszeit 20min bei 20 Grad Lookup",
  description:
    "Bounded off line reference: Named milestone dimensional/condition reference only, not fabricated universal material rule. Explicit topics namedCondition, limitations. No full/live authority, clinical diagnosis, safe-use approval or universal individual outcome.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { text: { type: "string" } },
        required: ["text"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
