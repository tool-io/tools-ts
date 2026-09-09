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
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "SSP1sustainability, SSP2middle-of-the-road, SSP3regional rivalry, SSP4inequality and SSP5fossil-fueled development describe socioeconomic narratives; emissions pathways append forcing levels.",
        reference: "IPCC AR6 scenario framework.",
        limitations:
          "Not assign likelihoods or infer temperature from an SSPnumber alone.",
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
      text: "SSP1sustainability, SSP2middle-of-the-road, SSP3regional rivalry, SSP4inequality and SSP5fossil-fueled development describe socioeconomic narratives; emissions pathways append forcing levels.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/ipcc-ar6-ssp-pathway-scenario-taxonomy-lookup",
  title: "IPCC AR6 SSP Pathway Scenario Taxonomy Lookup",
  description:
    "Bounded offline reference: SSP1sustainability, SSP2middle-of-the-road, SSP3regional rivalry, SSP4inequality and SSP5fossil-fueled development describe socioeconomic narratives; emissions pathways append forcing levels. Source: IPCC AR6 scenario framework. Not assign likelihoods or infer temperature from an SSPnumber alone. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
