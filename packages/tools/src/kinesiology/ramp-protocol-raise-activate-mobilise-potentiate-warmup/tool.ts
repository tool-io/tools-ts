import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch47-shared.js";
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
          "RAMPexpands to Raise, Activate, Mobilise, Potentiateas a warm-up planning framework.",
        reference: "Jeffreys, RAMPwarm-up framework.",
        limitations:
          "A framework label is not a safe individualized exercise sequence or guaranteed performance benefit.",
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
      text: "RAMPexpands to Raise, Activate, Mobilise, Potentiateas a warm-up planning framework.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/ramp-protocol-raise-activate-mobilise-potentiate-warmup",
  title: "Ramp Protocol Raise Activate Mobilise Potentiate Warmup",
  description:
    "Bounded offline reference: RAMPexpands to Raise, Activate, Mobilise, Potentiateas a warm-up planning framework. Source: Jeffreys, RAMPwarm-up framework. A framework label is not a safe individualized exercise sequence or guaranteed performance benefit. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
