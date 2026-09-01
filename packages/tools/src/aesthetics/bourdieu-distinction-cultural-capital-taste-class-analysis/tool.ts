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
          "Bourdieu analyzes taste and cultural capital as socially patterned within fields and class relations.",
        reference: "Bourdieu, Distinction 1979.",
        limitations:
          "Group patterns do not establish an individuals class, worth or preference from one artwork.",
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
      text: "Bourdieu analyzes taste and cultural capital as socially patterned within fields and class relations.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/bourdieu-distinction-cultural-capital-taste-class-analysis",
  title: "Bourdieu Distinction Cultural Capital Taste Class Analysis",
  description:
    "Bounded offline reference: Bourdieu analyzes taste and cultural capital as socially patterned within fields and class relations. Source: Bourdieu, Distinction 1979. Group patterns do not establish an individuals class, worth or preference from one artwork. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
