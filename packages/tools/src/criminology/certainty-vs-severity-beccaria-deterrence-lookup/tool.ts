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
          "Beccarias deterrence argument emphasizes promptness/certainty and proportional limits rather than cruelty or excessive severity.",
        reference: "Beccaria, On Crimes and Punishments 1764.",
        limitations:
          "Historical theory is not universal empirical proof or approval to impose punishment without rights safeguards.",
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
      text: "Beccarias deterrence argument emphasizes promptness/certainty and proportional limits rather than cruelty or excessive severity.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/certainty-vs-severity-beccaria-deterrence-lookup",
  title: "Certainty vs Severity Beccaria Deterrence Lookup",
  description:
    "Bounded offline reference: Beccarias deterrence argument emphasizes promptness/certainty and proportional limits rather than cruelty or excessive severity. Source: Beccaria, On Crimes and Punishments 1764. Historical theory is not universal empirical proof or approval to impose punishment without rights safeguards. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
