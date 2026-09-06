import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly coTeachingModel: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "coTeachingModel", label: "Co teaching model", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.coTeachingModel,
      {
        "one-teach-one-observe":
          "one leads instruction while one collects planned observations",
        station: "teachers lead stations with planned learner rotation",
        parallel: "teachers instruct separate groups on shared content",
        alternative:
          "one teaches a smaller group while the other teaches the larger group",
        team: "teachers share instruction of the whole group",
        "one-teach-one-assist":
          "one leads instruction while the other provides individual support",
      },
      "coTeachingModel",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { coTeachingModel: "parallel" } satisfies Input;
export const exampleOutput = {
  meaning: "teachers instruct separate groups on shared content",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/co-teaching-six-models-station-parallel-teaming-lookup",
  title: "Co Teaching Six Models Station Parallel Teaming Lookup",
  description:
    "Namedcommonco-teaching model descriptors, not staffing ratio or grouping schedule already implemented. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ coTeachingModel: value.coTeachingModel as string }),
});
export const run = tool.execute;
export default tool;
