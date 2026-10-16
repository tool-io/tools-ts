import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly cardType: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "cardType", label: "Card type", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    reference: pick(
      i.cardType,
      {
        summary: ["twitter:card", "twitter:title", "twitter:description"],
        summary_large_image: [
          "twitter:card",
          "twitter:title",
          "twitter:description",
          "twitter:image",
        ],
        player: [
          "twitter:card",
          "twitter:title",
          "twitter:description",
          "twitter:player",
          "twitter:player:width",
          "twitter:player:height",
        ],
        app: [
          "twitter:card",
          "twitter:app:name:iphone",
          "twitter:app:id:iphone",
        ],
      },
      "cardType",
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { cardType: "summary" },
  output: {
    result: {
      reference: ["twitter:card", "twitter:title", "twitter:description"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/twitter-card-type-tags-lookup",
  title: "Twitter Card Type Tags Lookup",
  description:
    "Illustrative common Twitter/X card metadata families; required fields/platform policy can change, not a live validation service.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "array", items: { type: "string" } } },
        required: ["reference"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
