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
          "Real and simulated prop food have different ingestion, allergy, hygiene, appearance and handling considerations.",
        reference: "Production prop risk-assessment practice.",
        limitations:
          "A fake-food label is not proof an object is safe to ingest; no food-safe approval or allergy advice.",
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
      text: "Real and simulated prop food have different ingestion, allergy, hygiene, appearance and handling considerations.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/prop-food-real-versus-fake-health-safety-distinction-lookup",
  title: "Prop Food Real Versus Fake Health Safety Distinction Lookup",
  description:
    "Bounded offline reference: Real and simulated prop food have different ingestion, allergy, hygiene, appearance and handling considerations. Source: Production prop risk-assessment practice. A fake-food label is not proof an object is safe to ingest; no food-safe approval or allergy advice. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
