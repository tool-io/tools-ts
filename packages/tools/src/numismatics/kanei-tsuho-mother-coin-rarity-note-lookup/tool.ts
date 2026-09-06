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
          "Mother coins and related production stages in Kan\u2019 ei Ts\u016bh\u014dcasting require specialist attribution of manufacturing evidence.",
        reference: "Japanese cash-coin catalogue scholarship.",
        limitations:
          "A crisp impression does not prove mother-coin status or rarity; no fabricated premium.",
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
      text: "Mother coins and related production stages in Kan\u2019 ei Ts\u016bh\u014dcasting require specialist attribution of manufacturing evidence.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/kanei-tsuho-mother-coin-rarity-note-lookup",
  title: "Kan'ei Ts\u016bh\u014d Mother Coin Rarity Note Lookup",
  description:
    "Bounded offline reference: Mother coins and related production stages in Kan\u2019 ei Ts\u016bh\u014dcasting require specialist attribution of manufacturing evidence. Source: Japanese cash-coin catalogue scholarship. A crisp impression does not prove mother-coin status or rarity; no fabricated premium. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
