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
          "Tennis-serve kinetic-chain descriptions often discuss coordinated lower-limb, trunk and upper-limb contributions rather than isolated arm action.",
        reference: "Tennis serve biomechanics research.",
        limitations:
          "Timing and technique vary; no universal safe sequence or coaching prescription.",
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
      text: "Tennis-serve kinetic-chain descriptions often discuss coordinated lower-limb, trunk and upper-limb contributions rather than isolated arm action.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/tennis-serve-kinetic-chain-sequence-lookup",
  title: "Tennis Serve Kinetic Chain Sequence Lookup",
  description:
    "Bounded offline reference: Tennis-serve kinetic-chain descriptions often discuss coordinated lower-limb, trunk and upper-limb contributions rather than isolated arm action. Source: Tennis serve biomechanics research. Timing and technique vary; no universal safe sequence or coaching prescription. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
