import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerDownburstFootprintClassIds: readonly string[];
  readonly callerDownburstFootprintRequiredEvidence: readonly (readonly number[])[];
  readonly observedDownburstFootprintEvidence: readonly number[];
  readonly knownDownburstFootprintEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerDownburstFootprintClassIds",
    label: "Caller downburst footprint class ids",
    kind: "stringList",
  },
  {
    id: "callerDownburstFootprintRequiredEvidence",
    label: "Caller downburst footprint required evidence",
    kind: "matrix",
  },
  {
    id: "observedDownburstFootprintEvidence",
    label: "Observed downburst footprint evidence",
    kind: "numberList",
  },
  {
    id: "knownDownburstFootprintEvidenceFlags",
    label: "Known downburst footprint evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerDownburstFootprintClassIds,
    input.callerDownburstFootprintRequiredEvidence,
    input.observedDownburstFootprintEvidence,
    input.knownDownburstFootprintEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDownburstFootprintClassIds: ["a", "b"],
  callerDownburstFootprintRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedDownburstFootprintEvidence: [1, 0],
  knownDownburstFootprintEvidenceFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  compatibleCallerClasses: ["a", "b"],
  fullyWitnessedCallerClasses: ["a"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/microburst-vs-macroburst-classifier",
  title: "Microburst vs Macroburst Classifier",
  description:
    "Observed downburst footprint/duration/wind evidence against caller micro/macroburst classification, not storm safety. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "compatibleCallerClasses",
      label: "Compatible caller classes",
      kind: "stringList",
    },
    {
      id: "fullyWitnessedCallerClasses",
      label: "Fully witnessed caller classes",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerDownburstFootprintClassIds:
        value.callerDownburstFootprintClassIds as readonly string[],
      callerDownburstFootprintRequiredEvidence:
        value.callerDownburstFootprintRequiredEvidence as readonly (readonly number[])[],
      observedDownburstFootprintEvidence:
        value.observedDownburstFootprintEvidence as readonly number[],
      knownDownburstFootprintEvidenceFlags:
        value.knownDownburstFootprintEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
