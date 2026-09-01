import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch-shared.js";
export type Input = Readonly<{
  readonly oldMeaningReferents: readonly string[];
  readonly newMeaningReferents: readonly string[];
}>;
export type Output = Readonly<{
  readonly extensionalShiftClass: string;
  readonly retainedReferentCount: number;
  readonly lostReferentCount: number;
  readonly gainedReferentCount: number;
}>;
const inputFields = [
  {
    id: "oldMeaningReferents",
    label: "Old meaning referents",
    kind: "stringList",
  },
  {
    id: "newMeaningReferents",
    label: "New meaning referents",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.oldMeaningReferents.length ||
    !input.newMeaningReferents.length ||
    [input.oldMeaningReferents, input.newMeaningReferents].some(
      (v) => new Set(v).size !== v.length || v.some((s) => !s.length),
    )
  )
    simpleError(
      "referents",
      "Nonempty distinct caller semantic referent labels required.",
    );
  const old = new Set(input.oldMeaningReferents),
    now = new Set(input.newMeaningReferents),
    kept = [...old].filter((v) => now.has(v)).length,
    lost = old.size - kept,
    gained = now.size - kept;
  return {
    extensionalShiftClass:
      lost === 0 && gained === 0
        ? "unchanged"
        : lost === 0
          ? "broadening"
          : gained === 0
            ? "narrowing"
            : kept === 0
              ? "disjoint-change"
              : "overlapping-change",
    retainedReferentCount: kept,
    lostReferentCount: lost,
    gainedReferentCount: gained,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  oldMeaningReferents: ["sparrow"],
  newMeaningReferents: ["sparrow", "eagle"],
} satisfies Input;
export const exampleOutput = {
  extensionalShiftClass: "broadening",
  retainedReferentCount: 1,
  lostReferentCount: 0,
  gainedReferentCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/semantic-shift-type-classifier",
  title: "Semantic Shift Type Classifier",
  description:
    "Classify caller explicit semantic extensions by retained/lost/gained referents, distinguishing narrowing/broadening/overlap; not automatic metaphor, evaluative shift or historical-causation inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "extensionalShiftClass",
      label: "Extensional shift class",
      kind: "string",
    },
    {
      id: "retainedReferentCount",
      label: "Retained referent count",
      kind: "number",
    },
    { id: "lostReferentCount", label: "Lost referent count", kind: "number" },
    {
      id: "gainedReferentCount",
      label: "Gained referent count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      oldMeaningReferents: value.oldMeaningReferents as readonly string[],
      newMeaningReferents: value.newMeaningReferents as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
