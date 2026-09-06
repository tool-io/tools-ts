import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
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
          "Dont take any wooden nickels is associated with caution about being cheated; wooden souvenir/promotional tokens also exist.",
        reference: "American idiom and token-history scholarship.",
        limitations:
          "No single universally proven origin or claim that every wooden token is fraudulent.",
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
      text: "Dont take any wooden nickels is associated with caution about being cheated; wooden souvenir/promotional tokens also exist.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/wooden-nickel-idiom-origin-phrase-history-lookup",
  title: "Wooden Nickel Idiom Origin Phrase History Lookup",
  description:
    "Bounded offline reference: Dont take any wooden nickels is associated with caution about being cheated; wooden souvenir/promotional tokens also exist. Source: American idiom and token-history scholarship. No single universally proven origin or claim that every wooden token is fraudulent. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
