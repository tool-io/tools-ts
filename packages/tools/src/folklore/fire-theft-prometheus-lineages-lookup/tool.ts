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
        hesiod:
          "Hesiod connects the theft and concealment of fire with Zeus, Prometheus and the Pandora narrative.",
        comparison:
          "For comparisons, retain original community, source, collector, date and consent rather than infer a common Prometheus lineage.",
        limitation:
          "No divine reality, universal archetype or independently proven shared origin is established.",
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
  input: { topic: "hesiod" },
  output: {
    result: {
      text: "Hesiod connects the theft and concealment of fire with Zeus, Prometheus and the Pandora narrative.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/fire-theft-prometheus-lineages-lookup",
  title: "Fire Theft Prometheus Lineages Lookup",
  description:
    "Bounded offline reference: Prometheus steals fire in Greek accounts; other traditions have distinct fire acquisition narratives. Source: Hesiod, Theogony535\u2013616; Works and Days42\u2013105. Resemblance alone cannot establish lineal transmission or collapse culture-specific figures. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
