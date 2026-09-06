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
          "Adolph AW einman designed the Walking Liberty half dollar and Winged Liberty Head dime, often called Mercury.",
        reference: "US Mint, coin designer histories.",
        limitations:
          "The dime depicts Liberty with a winged cap, not a portrait of the Roman god Mercury.",
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
      text: "Adolph AW einman designed the Walking Liberty half dollar and Winged Liberty Head dime, often called Mercury.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/weinman-designed-walking-liberty-mercury-dime-crossref",
  title: "Weinman Designed Walking Liberty Mercury Dime Crossref",
  description:
    "Bounded offline reference: Adolph AW einman designed the Walking Liberty half dollar and Winged Liberty Head dime, often called Mercury. Source: US Mint, coin designer histories. The dime depicts Liberty with a winged cap, not a portrait of the Roman god Mercury. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
