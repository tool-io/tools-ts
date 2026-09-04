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
          "Gambling charm traditions include locally meaningful objects and lucky-number narratives.",
        reference: "Dundes and other gambling/superstition studies.",
        limitations:
          "Charms do not alter independent game odds or establish a winning strategy.",
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
      text: "Gambling charm traditions include locally meaningful objects and lucky-number narratives.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/gambler-lucky-charms-rabbit-foot-seven-eleven-items-lookup",
  title: "Gambler Lucky Charms Rabbit Foot Seven Eleven Items Lookup",
  description:
    "Bounded offline reference: Gambling charm traditions include locally meaningful objects and lucky-number narratives. Source: Dundes and other gambling/superstition studies. Charms do not alter independent game odds or establish a winning strategy. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
