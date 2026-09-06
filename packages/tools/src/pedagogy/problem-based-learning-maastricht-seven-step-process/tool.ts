import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, stageAudit } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerObservedMaastrichtStageIds: readonly string[];
  readonly callerStageDeclaredOrder: readonly string[];
}>;
export type Output = Readonly<{
  readonly missingDeclaredStageIds: readonly string[];
  readonly orderInversionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerObservedMaastrichtStageIds",
    label: "Caller observed maastricht stage ids",
    kind: "stringList",
  },
  {
    id: "callerStageDeclaredOrder",
    label: "Caller stage declared order",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return stageAudit(
    input.callerObservedMaastrichtStageIds,
    input.callerStageDeclaredOrder,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObservedMaastrichtStageIds: ["clarify-terms", "synthesize-discuss"],
  callerStageDeclaredOrder: [
    "clarify-terms",
    "define-problem",
    "brainstorm",
    "structure-explanations",
    "formulate-learning-objectives",
    "self-study",
    "synthesize-discuss",
  ],
} satisfies Input;
export const exampleOutput = {
  missingDeclaredStageIds: [
    "define-problem",
    "brainstorm",
    "structure-explanations",
    "formulate-learning-objectives",
    "self-study",
  ],
  orderInversionIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/problem-based-learning-maastricht-seven-step-process",
  title: "Problem Based Learning Maastricht Seven Step Process",
  description:
    "Named Maastricht seven-jump process coverage/order audit, not clinical differential diagnosis generation. Audit exact supplied observed stages against the independently verified declared order, not pedagogical/performance efficacy. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "missingDeclaredStageIds",
      label: "Missing declared stage ids",
      kind: "stringList",
    },
    {
      id: "orderInversionIndices",
      label: "Order inversion indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerObservedMaastrichtStageIds:
        value.callerObservedMaastrichtStageIds as readonly string[],
      callerStageDeclaredOrder:
        value.callerStageDeclaredOrder as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
