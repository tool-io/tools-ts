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
          "The IOC RED-S model connects low energy availability with multiple potential health and performance domains.",
        reference: "IOC RED-S consensus literature.",
        limitations:
          "No single symptom proves REDs; clinical assessment and differential explanations remain essential.",
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
      text: "The IOC RED-S model connects low energy availability with multiple potential health and performance domains.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/ioc-red-s-health-consequences-model-map-lookup",
  title: "IOC Red S Health Consequences Model Map Lookup",
  description:
    "Bounded offline reference: The IOC RED-S model connects low energy availability with multiple potential health and performance domains. Source: IOC RED-S consensus literature. No single symptom proves REDs; clinical assessment and differential explanations remain essential. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
