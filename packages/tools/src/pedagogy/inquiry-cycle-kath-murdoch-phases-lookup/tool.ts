import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, stageAudit } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerObservedMurdochInquiryStageIds: readonly string[];
  readonly callerStageDeclaredOrder: readonly string[];
}>;
export type Output = Readonly<{
  readonly missingDeclaredStageIds: readonly string[];
  readonly orderInversionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerObservedMurdochInquiryStageIds",
    label: "Caller observed murdoch inquiry stage ids",
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
    input.callerObservedMurdochInquiryStageIds,
    input.callerStageDeclaredOrder,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObservedMurdochInquiryStageIds: ["tuning-in", "taking-action"],
  callerStageDeclaredOrder: [
    "tuning-in",
    "finding-out",
    "sorting-out",
    "going-further",
    "making-conclusions",
    "taking-action",
  ],
} satisfies Input;
export const exampleOutput = {
  missingDeclaredStageIds: [
    "finding-out",
    "sorting-out",
    "going-further",
    "making-conclusions",
  ],
  orderInversionIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/inquiry-cycle-kath-murdoch-phases-lookup",
  title: "Inquiry Cycle Kath Murdoch Phases Lookup",
  description:
    "Audit observed phases against the caller's independently verified Kath Murdoch six-phase variant. Inquiry may revisit phases; coverage and inversions are not a universally required linear sequence or an efficacy assessment.",
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
      callerObservedMurdochInquiryStageIds:
        value.callerObservedMurdochInquiryStageIds as readonly string[],
      callerStageDeclaredOrder:
        value.callerStageDeclaredOrder as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
