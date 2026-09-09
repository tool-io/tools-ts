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
          "Sortition selects by lot and can be stratified to support representativeness; Van Reybrouck advocates deliberative uses.",
        reference: "VanReybrouck, Against Elections; sortition literature.",
        limitations:
          "Selection design, consent, access and accountability matter; randomness alone does not confer legitimacy.",
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
      text: "Sortition selects by lot and can be stratified to support representativeness; Van Reybrouck advocates deliberative uses.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/sortition-selection-by-lot-van-reybrouck-advocacy-lookup",
  title: "Sortition Selection By Lot Van Reybrouck Advocacy Lookup",
  description:
    "Bounded offline reference: Sortition selects by lot and can be stratified to support representativeness; Van Reybrouck advocates deliberative uses. Source: VanReybrouck, Against Elections; sortition literature. Selection design, consent, access and accountability matter; randomness alone does not confer legitimacy. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
