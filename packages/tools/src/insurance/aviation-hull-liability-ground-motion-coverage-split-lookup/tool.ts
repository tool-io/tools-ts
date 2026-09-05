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
          "Aviation hull addresses insured aircraft property; liability addresses specified third-party injury/damage, with ground/in-motion distinctions in some forms.",
        reference: "Aviation policy wordings.",
        limitations:
          "Pilot, airworthiness, use and geographic conditions vary; no operational or coverage approval.",
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
      text: "Aviation hull addresses insured aircraft property; liability addresses specified third-party injury/damage, with ground/in-motion distinctions in some forms.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/aviation-hull-liability-ground-motion-coverage-split-lookup",
  title: "Aviation Hull Liability Ground Motion Coverage Split Lookup",
  description:
    "Bounded offline reference: Aviation hull addresses insured aircraft property; liability addresses specified third-party injury/damage, with ground/in-motion distinctions in some forms. Source: Aviation policy wordings. Pilot, airworthiness, use and geographic conditions vary; no operational or coverage approval. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
