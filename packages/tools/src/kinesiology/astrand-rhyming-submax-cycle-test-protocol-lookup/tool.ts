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
          "Astrand-Rhyming submaximal cycling estimation uses protocol-specific workload/heart-rate and age-related assumptions.",
        reference:
          "Astrandand Rhyming1954and subsequent validation literature.",
        limitations:
          "Population estimation is not measured VO2max or advice to perform testing without screening.",
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
      text: "Astrand-Rhyming submaximal cycling estimation uses protocol-specific workload/heart-rate and age-related assumptions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/astrand-rhyming-submax-cycle-test-protocol-lookup",
  title: "Astrand Rhyming Submax Cycle Test Protocol Lookup",
  description:
    "Bounded offline reference: Astrand-Rhyming submaximal cycling estimation uses protocol-specific workload/heart-rate and age-related assumptions. Source: Astrandand Rhyming1954and subsequent validation literature. Population estimation is not measured VO2max or advice to perform testing without screening. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
