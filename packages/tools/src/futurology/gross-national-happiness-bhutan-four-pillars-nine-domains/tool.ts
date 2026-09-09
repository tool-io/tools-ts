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
    enum: ["summary", "pillars", "domains", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Bhutans GNHframework commonly names four pillars and nine domains, distinguishing governance, sustainable socioeconomic development, culture and environment from domain measurements.",
        reference: "Centre for Bhutan and GNHStudies framework.",
        pillars:
          "Four pillars: sustainable and equitable socioeconomic development; preservation and promotion of culture; conservation of the environment; good governance.",
        domains:
          "Nine domains: psychological wellbeing; health; education; time use; cultural diversity and resilience; good governance; community vitality; ecological diversity and resilience; living standards.",
        limitations:
          "No individual/country score inferred or universal welfare measure.",
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
      text: "Bhutans GNHframework commonly names four pillars and nine domains, distinguishing governance, sustainable socioeconomic development, culture and environment from domain measurements.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/gross-national-happiness-bhutan-four-pillars-nine-domains",
  title: "Gross National Happiness Bhutan Four Pillars Nine Domains",
  description:
    "Bounded offline reference to Bhutan's GNH framework with the four pillars and nine named domains. Source: Centre for Bhutan and GNH Studies. No individual/country score inferred or universal welfare measure. Explicit topic keys: summary, pillars, domains, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
