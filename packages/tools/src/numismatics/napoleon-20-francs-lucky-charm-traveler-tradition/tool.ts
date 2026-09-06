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
          "Lucky Napoleon gold-coin narratives are collector/folkloric traditions, not a protective mechanism.",
        reference: "French gold-coin histories and collector folklore.",
        limitations:
          "Avoid conflating Napoleon effigies with Genius/angel types; no magical efficacy or universal traveler custom.",
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
      text: "Lucky Napoleon gold-coin narratives are collector/folkloric traditions, not a protective mechanism.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/napoleon-20-francs-lucky-charm-traveler-tradition",
  title: "Napoleon 20 Francs Lucky Charm Traveler Tradition",
  description:
    "Bounded offline reference: Lucky Napoleon gold-coin narratives are collector/folkloric traditions, not a protective mechanism. Source: French gold-coin histories and collector folklore. Avoid conflating Napoleon effigies with Genius/angel types; no magical efficacy or universal traveler custom. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
