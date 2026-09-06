import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, binary } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerPromptTexts: readonly string[];
  readonly callerExpectedResponseTexts: readonly string[];
  readonly observedSignalBeforeResponseFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly choralScriptLines: readonly string[];
  readonly missingSignalIndices: readonly number[];
}>;
const inputFields = [
  { id: "callerPromptTexts", label: "Caller prompt texts", kind: "stringList" },
  {
    id: "callerExpectedResponseTexts",
    label: "Caller expected response texts",
    kind: "stringList",
  },
  {
    id: "observedSignalBeforeResponseFlags",
    label: "Observed signal before response flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.observedSignalBeforeResponseFlags,
    "observedSignalBeforeResponseFlags",
  );
  aligned(
    input.callerPromptTexts,
    input.callerExpectedResponseTexts,
    "callerPromptTexts",
  );
  aligned(
    input.callerPromptTexts,
    input.observedSignalBeforeResponseFlags,
    "callerPromptTexts",
  );
  return {
    choralScriptLines: input.callerPromptTexts.map(
      (v, i) =>
        "Teacher: " +
        v +
        " | Signal | Class: " +
        input.callerExpectedResponseTexts[i],
    ),
    missingSignalIndices: input.observedSignalBeforeResponseFlags.flatMap(
      (v, i) => (v ? [] : [i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPromptTexts: ["What is two plus two?"],
  callerExpectedResponseTexts: ["Four."],
  observedSignalBeforeResponseFlags: [1],
} satisfies Input;
export const exampleOutput = {
  choralScriptLines: ["Teacher: What is two plus two? | Signal | Class: Four."],
  missingSignalIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/direct-instruction-choral-response-scripting-lookup",
  title: "Direct Instruction Choral Response Scripting Lookup",
  description:
    "Render bounded explicit direct instruction prompt/signal/response script with observed signal coverage; no correctness or participation inferred from choral reply. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "choralScriptLines",
      label: "Choral script lines",
      kind: "stringList",
    },
    {
      id: "missingSignalIndices",
      label: "Missing signal indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerPromptTexts: value.callerPromptTexts as readonly string[],
      callerExpectedResponseTexts:
        value.callerExpectedResponseTexts as readonly string[],
      observedSignalBeforeResponseFlags:
        value.observedSignalBeforeResponseFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
