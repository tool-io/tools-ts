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
          "Some baseball participants avoid mentioning an ongoing no-hitter as a jinx custom.",
        reference: "Baseball folklore and oral-history collections.",
        limitations:
          "Silence does not causally guarantee a result; team/era traditions differ.",
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
      text: "Some baseball participants avoid mentioning an ongoing no-hitter as a jinx custom.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/baseball-no-hitter-jinx-dugout-rituals-lookup",
  title: "Baseball No Hitter Jinx Dugout Rituals Lookup",
  description:
    "Bounded offline reference: Some baseball participants avoid mentioning an ongoing no-hitter as a jinx custom. Source: Baseball folklore and oral-history collections. Silence does not causally guarantee a result; team/era traditions differ. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
