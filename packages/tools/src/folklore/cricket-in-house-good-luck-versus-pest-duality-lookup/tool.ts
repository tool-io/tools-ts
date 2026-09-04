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
          "House-cricket luck traditions and household pest concerns are different interpretive frames.",
        reference:
          "Comparative cricket folklore; entomological household guidance.",
        limitations:
          "Belief does not identify species, health risk or effective pest treatment.",
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
      text: "House-cricket luck traditions and household pest concerns are different interpretive frames.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/cricket-in-house-good-luck-versus-pest-duality-lookup",
  title: "Cricket in House Good Luck Versus Pest Duality Lookup",
  description:
    "Bounded offline reference: House-cricket luck traditions and household pest concerns are different interpretive frames. Source: Comparative cricket folklore; entomological household guidance. Belief does not identify species, health risk or effective pest treatment. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
