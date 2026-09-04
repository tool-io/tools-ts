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
          "Egg buoyancy can reflect changing air-cell size but floating does not reliably certify freshness or safety.",
        reference: "USDA, Shell Eggs from Farm to Table.",
        limitations:
          "Do not taste an egg to test safety; handling/storage and authoritative food-safety guidance matter.",
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
      text: "Egg buoyancy can reflect changing air-cell size but floating does not reliably certify freshness or safety.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/egg-float-freshness-test-fact-checker",
  title: "Egg Float Freshness Test Fact Checker",
  description:
    "Bounded offline reference: Egg buoyancy can reflect changing air-cell size but floating does not reliably certify freshness or safety. Source: USDA, Shell Eggs from Farm to Table. Do not taste an egg to test safety; handling/storage and authoritative food-safety guidance matter. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
