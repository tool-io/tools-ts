import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, stageAudit } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerObservedGagneStageIds: readonly string[];
  readonly callerStageDeclaredOrder: readonly string[];
}>;
export type Output = Readonly<{
  readonly missingDeclaredStageIds: readonly string[];
  readonly orderInversionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerObservedGagneStageIds",
    label: "Caller observed gagne stage ids",
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
    input.callerObservedGagneStageIds,
    input.callerStageDeclaredOrder,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObservedGagneStageIds: ["gain-attention", "support-retention-transfer"],
  callerStageDeclaredOrder: [
    "gain-attention",
    "state-objectives",
    "recall-prior-learning",
    "present-content",
    "provide-guidance",
    "elicit-performance",
    "provide-feedback",
    "assess-performance",
    "support-retention-transfer",
  ],
} satisfies Input;
export const exampleOutput = {
  missingDeclaredStageIds: [
    "state-objectives",
    "recall-prior-learning",
    "present-content",
    "provide-guidance",
    "elicit-performance",
    "provide-feedback",
    "assess-performance",
  ],
  orderInversionIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/gagne-nine-events-of-instruction-sequence-lookup",
  title: "Gagne Nine Events of Instruction Sequence Lookup",
  description:
    "Named Gagne nine events observed coverage/order audit, not claim missing event implies ineffective instruction. Audit exact supplied observed stages against the independently verified declared order, not pedagogical/performance efficacy. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
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
      callerObservedGagneStageIds:
        value.callerObservedGagneStageIds as readonly string[],
      callerStageDeclaredOrder:
        value.callerStageDeclaredOrder as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
