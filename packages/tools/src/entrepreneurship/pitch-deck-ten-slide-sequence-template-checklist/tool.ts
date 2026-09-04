import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, unique } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerTenSlideSequenceIds: readonly string[];
  readonly observedSlideIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly missingCallerSlideIds: readonly string[];
  readonly callerSequenceInversionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerTenSlideSequenceIds",
    label: "Caller ten slide sequence ids",
    kind: "stringList",
  },
  { id: "observedSlideIds", label: "Observed slide ids", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.callerTenSlideSequenceIds.length !== 10)
    simpleError(
      "template",
      "Exactly10independently selected unique template topics.",
    );
  unique(input.callerTenSlideSequenceIds, "template");
  unique(input.observedSlideIds, "slides");
  const positions = input.observedSlideIds.map((v) =>
    input.callerTenSlideSequenceIds.indexOf(v),
  );
  return {
    missingCallerSlideIds: input.callerTenSlideSequenceIds.filter(
      (v) => !input.observedSlideIds.includes(v),
    ),
    callerSequenceInversionIndices: positions.flatMap((v, i) =>
      i > 0 && v >= 0 && positions[i - 1] >= 0 && v < positions[i - 1]
        ? [i]
        : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTenSlideSequenceIds: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
  observedSlideIds: ["a", "c", "b", "d", "e", "f", "g", "h", "i", "j"],
} satisfies Input;
export const exampleOutput = {
  missingCallerSlideIds: [],
  callerSequenceInversionIndices: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/pitch-deck-ten-slide-sequence-template-checklist",
  title: "Pitch Deck Ten Slide Sequence Template Checklist",
  description:
    "Audit actual pitch-deck topic coverage/order against caller selected ten-topic template, not a universal ten-slide persuasive sequence. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "missingCallerSlideIds",
      label: "Missing caller slide ids",
      kind: "stringList",
    },
    {
      id: "callerSequenceInversionIndices",
      label: "Caller sequence inversion indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTenSlideSequenceIds:
        value.callerTenSlideSequenceIds as readonly string[],
      observedSlideIds: value.observedSlideIds as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
