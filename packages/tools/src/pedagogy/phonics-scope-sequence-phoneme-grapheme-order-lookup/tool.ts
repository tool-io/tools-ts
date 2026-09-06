import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, stageAudit } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerObservedPhonicsStageIds: readonly string[];
  readonly callerStageDeclaredOrder: readonly string[];
}>;
export type Output = Readonly<{
  readonly missingDeclaredStageIds: readonly string[];
  readonly orderInversionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerObservedPhonicsStageIds",
    label: "Caller observed phonics stage ids",
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
    input.callerObservedPhonicsStageIds,
    input.callerStageDeclaredOrder,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObservedPhonicsStageIds: ["oral-phoneme-awareness", "connected-text"],
  callerStageDeclaredOrder: [
    "oral-phoneme-awareness",
    "selected-grapheme-correspondences",
    "decoding-practice",
    "connected-text",
  ],
} satisfies Input;
export const exampleOutput = {
  missingDeclaredStageIds: [
    "selected-grapheme-correspondences",
    "decoding-practice",
  ],
  orderInversionIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/phonics-scope-sequence-phoneme-grapheme-order-lookup",
  title: "Phonics Scope Sequence Phoneme Grapheme Order Lookup",
  description:
    "Audit observed phonics stages against the caller's independently verified program and orthography-specific sequence. Reports missing stages and inversions; there is no embedded universal English phoneme–grapheme order or mastery guarantee.",
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
      callerObservedPhonicsStageIds:
        value.callerObservedPhonicsStageIds as readonly string[],
      callerStageDeclaredOrder:
        value.callerStageDeclaredOrder as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
