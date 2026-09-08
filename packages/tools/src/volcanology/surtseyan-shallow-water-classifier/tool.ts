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
  readonly callerShallowWaterInteractionClassIds: readonly string[];
  readonly callerShallowWaterInteractionRequiredEvidence: readonly (readonly number[])[];
  readonly observedShallowWaterInteractionEvidence: readonly number[];
  readonly knownShallowWaterInteractionEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly contradictionFreeCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerShallowWaterInteractionClassIds",
    label: "Caller shallow water interaction class ids",
    kind: "stringList",
  },
  {
    id: "callerShallowWaterInteractionRequiredEvidence",
    label: "Caller shallow water interaction required evidence",
    kind: "matrix",
  },
  {
    id: "observedShallowWaterInteractionEvidence",
    label: "Observed shallow water interaction evidence",
    kind: "numberList",
  },
  {
    id: "knownShallowWaterInteractionEvidenceFlags",
    label: "Known shallow water interaction evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.observedShallowWaterInteractionEvidence,
    "observedShallowWaterInteractionEvidence",
  );
  binary(
    input.knownShallowWaterInteractionEvidenceFlags,
    "knownShallowWaterInteractionEvidenceFlags",
  );
  aligned(
    input.observedShallowWaterInteractionEvidence,
    input.knownShallowWaterInteractionEvidenceFlags,
    "observedShallowWaterInteractionEvidence",
  );
  aligned(
    input.callerShallowWaterInteractionClassIds,
    input.callerShallowWaterInteractionRequiredEvidence,
    "callerShallowWaterInteractionClassIds",
  );
  unique(input.callerShallowWaterInteractionClassIds, "classes");
  if (
    input.callerShallowWaterInteractionRequiredEvidence.some((row) =>
      row.every((v) => v === 0),
    )
  )
    simpleError(
      "criteria",
      "Every caller class requires at least one positive evidence witness.",
    );
  if (
    shape(
      input.callerShallowWaterInteractionRequiredEvidence,
      "requirements",
    ) !== input.observedShallowWaterInteractionEvidence.length
  )
    simpleError(
      "criteria",
      "Caller one binary requirement per evidence column.",
    );
  input.callerShallowWaterInteractionRequiredEvidence.forEach((row) =>
    row.forEach((v) => {
      if (v !== 0 && v !== 1)
        simpleError("criteria", "Binary positive evidence requirements.");
    }),
  );
  const compatible = input.callerShallowWaterInteractionClassIds.filter(
      (_, i) =>
        input.callerShallowWaterInteractionRequiredEvidence[i].every(
          (v, j) =>
            !v ||
            !input.knownShallowWaterInteractionEvidenceFlags[j] ||
            input.observedShallowWaterInteractionEvidence[j] === 1,
        ),
    ),
    complete = input.callerShallowWaterInteractionClassIds.filter((_, i) =>
      input.callerShallowWaterInteractionRequiredEvidence[i].every(
        (v, j) =>
          !v ||
          (input.knownShallowWaterInteractionEvidenceFlags[j] === 1 &&
            input.observedShallowWaterInteractionEvidence[j] === 1),
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
  callerShallowWaterInteractionClassIds: ["class-a", "class-b"],
  callerShallowWaterInteractionRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedShallowWaterInteractionEvidence: [1, 0],
  knownShallowWaterInteractionEvidenceFlags: [1, 0],
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
  id: "volcanology/surtseyan-shallow-water-classifier",
  title: "Surtseyan Shallow Water Classifier",
  description:
    "Screen independently observed magma-water interaction and vent-water context using caller Surtseyan evidence requirements, not depth alone. Positive caller evidence rules only; missing evidence retains compatible possibilities, overlaps not forced to one identity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      callerShallowWaterInteractionClassIds:
        value.callerShallowWaterInteractionClassIds as readonly string[],
      callerShallowWaterInteractionRequiredEvidence:
        value.callerShallowWaterInteractionRequiredEvidence as readonly (readonly number[])[],
      observedShallowWaterInteractionEvidence:
        value.observedShallowWaterInteractionEvidence as readonly number[],
      knownShallowWaterInteractionEvidenceFlags:
        value.knownShallowWaterInteractionEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
