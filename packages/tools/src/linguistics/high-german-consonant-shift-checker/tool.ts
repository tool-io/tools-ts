import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerProtoForms: readonly string[];
  readonly observedHighGermanForms: readonly string[];
  readonly callerConditionedSourceForms: readonly string[];
  readonly callerConditionedTargetForms: readonly string[];
}>;
export type Output = Readonly<{
  readonly callerCorrespondenceFlags: readonly number[];
}>;
const inputFields = [
  { id: "callerProtoForms", label: "Caller proto forms", kind: "stringList" },
  {
    id: "observedHighGermanForms",
    label: "Observed high german forms",
    kind: "stringList",
  },
  {
    id: "callerConditionedSourceForms",
    label: "Caller conditioned source forms",
    kind: "stringList",
  },
  {
    id: "callerConditionedTargetForms",
    label: "Caller conditioned target forms",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerProtoForms,
    input.observedHighGermanForms,
    "callerProtoForms",
  );
  aligned(
    input.callerConditionedSourceForms,
    input.callerConditionedTargetForms,
    "callerConditionedSourceForms",
  );
  unique(input.callerConditionedSourceForms, "conditioned correspondence keys");
  return {
    callerCorrespondenceFlags: input.callerProtoForms.map((v, i) => {
      const j = input.callerConditionedSourceForms.indexOf(v);
      return j >= 0 &&
        input.observedHighGermanForms[i] ===
          input.callerConditionedTargetForms[j]
        ? 1
        : 0;
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerProtoForms: ["p", "t", "k"],
  observedHighGermanForms: ["pf", "ts", "x"],
  callerConditionedSourceForms: ["p", "t", "k"],
  callerConditionedTargetForms: ["pf", "ts", "x"],
} satisfies Input;
export const exampleOutput = {
  callerCorrespondenceFlags: [1, 1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/high-german-consonant-shift-checker",
  title: "High German Consonant Shift Pair Check",
  description:
    "Audit actual independently conditioned HighGerman consonant shift source/target token pairs; caller supplies positional/date conditioning, no automatic word-level historical transformation. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCorrespondenceFlags",
      label: "Caller correspondence flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerProtoForms: value.callerProtoForms as readonly string[],
      observedHighGermanForms:
        value.observedHighGermanForms as readonly string[],
      callerConditionedSourceForms:
        value.callerConditionedSourceForms as readonly string[],
      callerConditionedTargetForms:
        value.callerConditionedTargetForms as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
