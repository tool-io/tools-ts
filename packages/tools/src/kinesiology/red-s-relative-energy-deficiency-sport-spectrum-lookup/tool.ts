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
          "REDsdescribes health/performance consequences of problematic low energy availability in diverse athletes.",
        reference: "IOC RED-S 2023 consensus.",
        limitations:
          "A spectrum framework does not establish an individuals energy deficit or treatment needs.",
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
      text: "REDsdescribes health/performance consequences of problematic low energy availability in diverse athletes.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/red-s-relative-energy-deficiency-sport-spectrum-lookup",
  title: "Red S Relative Energy Deficiency Sport Spectrum Lookup",
  description:
    "Bounded offline reference: REDsdescribes health/performance consequences of problematic low energy availability in diverse athletes. Source: IOC RED-S 2023 consensus. A spectrum framework does not establish an individuals energy deficit or treatment needs. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
