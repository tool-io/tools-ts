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
        summary:
          "Woolly-bear band patterns are affected by biological/environmental history and are not a validated stand-alone forecast of the coming winter.",
        reference:
          "Entomological interpretation resources; National Weather Service weather-lore notes.",
        limitations:
          "No calibrated future-weather accuracy or universal species rule is supplied.",
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
      text: "Woolly-bear band patterns are affected by biological/environmental history and are not a validated stand-alone forecast of the coming winter.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/woolly-bear-caterpillar-winter-forecast-verdict-checker",
  title: "Woolly Bear Caterpillar Winter Forecast Verdict Checker",
  description:
    "Bounded offline reference: Woolly-bear band patterns are affected by biological/environmental history and are not a validated stand-alone forecast of the coming winter. Source: Entomological interpretation resources; National Weather Service weather-lore notes. No calibrated future-weather accuracy or universal species rule is supplied. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
