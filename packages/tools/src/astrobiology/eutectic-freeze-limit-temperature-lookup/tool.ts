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
          "Eutectic freezing depends on actual solutes, concentrations and pressure; cold-tolerant organisms do not define one universal liquid-water limit.",
        reference: "Phase-equilibrium and extremophile literature.",
        limitations:
          "The chaoboriid-like premise is not a calibrated eutectic reference; no default temperature is fabricated.",
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
      text: "Eutectic freezing depends on actual solutes, concentrations and pressure; cold-tolerant organisms do not define one universal liquid-water limit.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/eutectic-freeze-limit-temperature-lookup",
  title:
    "Chaoboriid-like Extreme Cold Eutectic Freeze Limit Temperature Lookup",
  description:
    "Bounded offline reference: Eutectic freezing depends on actual solutes, concentrations and pressure; cold-tolerant organisms do not define one universal liquid-water limit. Source: Phase-equilibrium and extremophile literature. The chaoboriid-like premise is not a calibrated eutectic reference; no default temperature is fabricated. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
