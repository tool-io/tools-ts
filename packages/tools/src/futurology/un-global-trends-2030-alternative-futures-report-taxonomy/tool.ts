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
          "Global Trends 2030:Alternative Worlds is a USNational Intelligence Council report, not a UN report. It presents four illustrative worlds:Stalled Engines, Fusion, Gini-Out-of-the-Bottle, Nonstate World.",
        reference: "USNIC, Global Trends 2030:Alternative Worlds 2012.",
        limitations:
          "Misattribution corrected; scenarios are not official probabilities or a current world assessment.",
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
      text: "Global Trends 2030:Alternative Worlds is a USNational Intelligence Council report, not a UN report. It presents four illustrative worlds:Stalled Engines, Fusion, Gini-Out-of-the-Bottle, Nonstate World.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/un-global-trends-2030-alternative-futures-report-taxonomy",
  title: "UN Global Trends 2030 Alternative Futures Report Taxonomy",
  description:
    "Bounded offline reference: Global Trends 2030:Alternative Worlds is a USNational Intelligence Council report, not a UN report. It presents four illustrative worlds:Stalled Engines, Fusion, Gini-Out-of-the-Bottle, Nonstate World. Source: USNIC, Global Trends 2030:Alternative Worlds 2012. Misattribution corrected; scenarios are not official probabilities or a current world assessment. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
