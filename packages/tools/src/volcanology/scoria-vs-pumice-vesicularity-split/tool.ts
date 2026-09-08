import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
  shape,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerVesicularRockClassIds: readonly string[];
  readonly callerVesicularRockRequiredEvidence: readonly (readonly number[])[];
  readonly observedVesicularRockEvidence: readonly number[];
  readonly knownVesicularRockEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly contradictionFreeCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerVesicularRockClassIds",
    label: "Caller vesicular rock class ids",
    kind: "stringList",
  },
  {
    id: "callerVesicularRockRequiredEvidence",
    label: "Caller vesicular rock required evidence",
    kind: "matrix",
  },
  {
    id: "observedVesicularRockEvidence",
    label: "Observed vesicular rock evidence",
    kind: "numberList",
  },
  {
    id: "knownVesicularRockEvidenceFlags",
    label: "Known vesicular rock evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.observedVesicularRockEvidence, "observedVesicularRockEvidence");
  binary(
    input.knownVesicularRockEvidenceFlags,
    "knownVesicularRockEvidenceFlags",
  );
  aligned(
    input.observedVesicularRockEvidence,
    input.knownVesicularRockEvidenceFlags,
    "observedVesicularRockEvidence",
  );
  aligned(
    input.callerVesicularRockClassIds,
    input.callerVesicularRockRequiredEvidence,
    "callerVesicularRockClassIds",
  );
  unique(input.callerVesicularRockClassIds, "classes");
  if (
    input.callerVesicularRockRequiredEvidence.some((row) =>
      row.every((v) => v === 0),
    )
  )
    simpleError(
      "criteria",
      "Every caller class requires at least one positive evidence witness.",
    );
  if (
    shape(input.callerVesicularRockRequiredEvidence, "requirements") !==
    input.observedVesicularRockEvidence.length
  )
    simpleError(
      "criteria",
      "Caller one binary requirement per evidence column.",
    );
  input.callerVesicularRockRequiredEvidence.forEach((row) =>
    row.forEach((v) => {
      if (v !== 0 && v !== 1)
        simpleError("criteria", "Binary positive evidence requirements.");
    }),
  );
  const compatible = input.callerVesicularRockClassIds.filter((_, i) =>
      input.callerVesicularRockRequiredEvidence[i].every(
        (v, j) =>
          !v ||
          !input.knownVesicularRockEvidenceFlags[j] ||
          input.observedVesicularRockEvidence[j] === 1,
      ),
    ),
    complete = input.callerVesicularRockClassIds.filter((_, i) =>
      input.callerVesicularRockRequiredEvidence[i].every(
        (v, j) =>
          !v ||
          (input.knownVesicularRockEvidenceFlags[j] === 1 &&
            input.observedVesicularRockEvidence[j] === 1),
      ),
    );
  return {
    contradictionFreeCallerClasses: compatible,
    fullyWitnessedCallerClasses: complete,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVesicularRockClassIds: ["class-a", "class-b"],
  callerVesicularRockRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedVesicularRockEvidence: [1, 0],
  knownVesicularRockEvidenceFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  contradictionFreeCallerClasses: ["class-a", "class-b"],
  fullyWitnessedCallerClasses: ["class-a"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/scoria-vs-pumice-vesicularity-split",
  title: "Scoria vs Pumice Vesicularity Split Checker",
  description:
    "Screen independent density/composition/vesicle context using caller scoria/pumice evidence rules, vesicularity alone not sufficient identity. Positive caller evidence rules only; missing evidence retains compatible possibilities, overlaps not forced to one identity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "contradictionFreeCallerClasses",
      label: "Contradiction free caller classes",
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
      callerVesicularRockClassIds:
        value.callerVesicularRockClassIds as readonly string[],
      callerVesicularRockRequiredEvidence:
        value.callerVesicularRockRequiredEvidence as readonly (readonly number[])[],
      observedVesicularRockEvidence:
        value.observedVesicularRockEvidence as readonly number[],
      knownVesicularRockEvidenceFlags:
        value.knownVesicularRockEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
