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
          "Financial-data access evolved from screen scraping toward standardized APIs and consent-based frameworks in many markets.",
        reference: "Financial-data-access standards and regulator materials.",
        limitations:
          "No single universal migration date, permission scope or proof that an API alone ensures privacy/security.",
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
      text: "Financial-data access evolved from screen scraping toward standardized APIs and consent-based frameworks in many markets.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/aggregators-screen-scraping-to-open-banking-api-evolution-history",
  title: "Aggregators Screen Scraping to Open Banking Api Evolution History",
  description:
    "Bounded offline reference: Financial-data access evolved from screen scraping toward standardized APIs and consent-based frameworks in many markets. Source: Financial-data-access standards and regulator materials. No single universal migration date, permission scope or proof that an API alone ensures privacy/security. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
