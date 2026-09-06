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
          "Flying Eagle cents include scarce 1856 patterns and regular 1857\u20131858 issues.",
        reference: "US Mint/US cent catalogue histories.",
        limitations:
          "The titles three-year run 1857\u201358wording is misleading:two regular issue years, with 1856 pattern context.",
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
      text: "Flying Eagle cents include scarce 1856 patterns and regular 1857\u20131858 issues.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/flying-eagle-three-year-run-1857-58-rarity-note",
  title: "Flying Eagle Three Year Run 1857-58 Rarity Note",
  description:
    "Bounded offline reference: Flying Eagle cents include scarce 1856 patterns and regular 1857\u20131858 issues. Source: US Mint/US cent catalogue histories. The titles three-year run 1857\u201358wording is misleading:two regular issue years, with 1856 pattern context. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
