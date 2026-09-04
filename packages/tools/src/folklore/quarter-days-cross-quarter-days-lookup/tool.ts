import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        englishQuarterDays:
          "March25, June24, September29, December25 are conventional English quarter days.",
        scottishTermDays:
          "Scottish term-day conventions differ by era; modern legal dates require independent verification.",
        crossQuarter:
          "Imbolc, Beltane, Lughnasadh and Samhain are associated with early February, May, August and November in particular Gaelic traditions.",
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
  input: { topic: "englishQuarterDays" },
  output: {
    result: {
      text: "March25, June24, September29, December25 are conventional English quarter days.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/quarter-days-cross-quarter-days-lookup",
  title: "Quarter Days Cross Quarter Days Lookup",
  description:
    "Bounded offline reference: English quarter days commonly are Lady Day, Midsummer, Michaelmas and Christmas. Source: Simpson and Roud, A Dictionary of English Folklore, quarter days. Calendar and regional systems differ; astronomical cross-quarter dates are not fixed universal festival dates. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
