import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, pick } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedInstructionVerb: string;
  readonly callerContextVerbKeys: readonly string[];
  readonly callerContextBloomLevels: readonly string[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerBloomLevels: readonly string[];
}>;
const inputFields = [
  {
    id: "observedInstructionVerb",
    label: "Observed instruction verb",
    kind: "string",
  },
  {
    id: "callerContextVerbKeys",
    label: "Caller context verb keys",
    kind: "stringList",
  },
  {
    id: "callerContextBloomLevels",
    label: "Caller context bloom levels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerContextVerbKeys,
    input.callerContextBloomLevels,
    "callerContextVerbKeys",
  );
  input.callerContextBloomLevels.forEach((v) =>
    pick(
      v,
      {
        remember: 0,
        understand: 1,
        apply: 2,
        analyze: 3,
        evaluate: 4,
        create: 5,
      },
      "level",
    ),
  );
  return {
    compatibleCallerBloomLevels: [
      ...new Set(
        input.callerContextBloomLevels.filter(
          (_, i) =>
            input.callerContextVerbKeys[i] === input.observedInstructionVerb,
        ),
      ),
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedInstructionVerb: "explain",
  callerContextVerbKeys: ["explain", "explain", "list"],
  callerContextBloomLevels: ["understand", "analyze", "remember"],
} satisfies Input;
export const exampleOutput = {
  compatibleCallerBloomLevels: ["understand", "analyze"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/bloom-taxonomy-verb-wheel-level-classifier",
  title: "Bloom Taxonomy Verb Wheel Level Classifier",
  description:
    "Exact verb in caller context-specific Bloom crosswalk with multiple levels retained; verbal one cannot determine cognitive demand, unmatched returns no evidence. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "compatibleCallerBloomLevels",
      label: "Compatible caller bloom levels",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedInstructionVerb: value.observedInstructionVerb as string,
      callerContextVerbKeys: value.callerContextVerbKeys as readonly string[],
      callerContextBloomLevels:
        value.callerContextBloomLevels as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
