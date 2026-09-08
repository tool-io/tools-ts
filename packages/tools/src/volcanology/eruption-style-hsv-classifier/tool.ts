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
  readonly callerEruptionStyleClassIds: readonly string[];
  readonly callerEruptionStyleRequiredEvidence: readonly (readonly number[])[];
  readonly observedEruptionStyleEvidence: readonly number[];
  readonly knownEruptionStyleEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly contradictionFreeCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerEruptionStyleClassIds",
    label: "Caller eruption style class ids",
    kind: "stringList",
  },
  {
    id: "callerEruptionStyleRequiredEvidence",
    label: "Caller eruption style required evidence",
    kind: "matrix",
  },
  {
    id: "observedEruptionStyleEvidence",
    label: "Observed eruption style evidence",
    kind: "numberList",
  },
  {
    id: "knownEruptionStyleEvidenceFlags",
    label: "Known eruption style evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.observedEruptionStyleEvidence, "observedEruptionStyleEvidence");
  binary(
    input.knownEruptionStyleEvidenceFlags,
    "knownEruptionStyleEvidenceFlags",
  );
  aligned(
    input.observedEruptionStyleEvidence,
    input.knownEruptionStyleEvidenceFlags,
    "observedEruptionStyleEvidence",
  );
  aligned(
    input.callerEruptionStyleClassIds,
    input.callerEruptionStyleRequiredEvidence,
    "callerEruptionStyleClassIds",
  );
  unique(input.callerEruptionStyleClassIds, "classes");
  if (
    input.callerEruptionStyleRequiredEvidence.some((row) =>
      row.every((v) => v === 0),
    )
  )
    simpleError(
      "criteria",
      "Every caller class requires at least one positive evidence witness.",
    );
  if (
    shape(input.callerEruptionStyleRequiredEvidence, "requirements") !==
    input.observedEruptionStyleEvidence.length
  )
    simpleError(
      "criteria",
      "Caller one binary requirement per evidence column.",
    );
  input.callerEruptionStyleRequiredEvidence.forEach((row) =>
    row.forEach((v) => {
      if (v !== 0 && v !== 1)
        simpleError("criteria", "Binary positive evidence requirements.");
    }),
  );
  const compatible = input.callerEruptionStyleClassIds.filter((_, i) =>
      input.callerEruptionStyleRequiredEvidence[i].every(
        (v, j) =>
          !v ||
          !input.knownEruptionStyleEvidenceFlags[j] ||
          input.observedEruptionStyleEvidence[j] === 1,
      ),
    ),
    complete = input.callerEruptionStyleClassIds.filter((_, i) =>
      input.callerEruptionStyleRequiredEvidence[i].every(
        (v, j) =>
          !v ||
          (input.knownEruptionStyleEvidenceFlags[j] === 1 &&
            input.observedEruptionStyleEvidence[j] === 1),
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
  callerEruptionStyleClassIds: ["class-a", "class-b"],
  callerEruptionStyleRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedEruptionStyleEvidence: [1, 0],
  knownEruptionStyleEvidenceFlags: [1, 0],
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
  id: "volcanology/eruption-style-hsv-classifier",
  title: "Eruption Style Hawaiian Strombolian Vulcanian Classifier",
  description:
    "Screen actual independently observed continuous fountains/discrete bursts/plug disruption against caller Hawaiian/Strombolian/Vulcanian evidence rules, overlaps/mixed style retained. Positive caller evidence rules only; missing evidence retains compatible possibilities, overlaps not forced to one identity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      callerEruptionStyleClassIds:
        value.callerEruptionStyleClassIds as readonly string[],
      callerEruptionStyleRequiredEvidence:
        value.callerEruptionStyleRequiredEvidence as readonly (readonly number[])[],
      observedEruptionStyleEvidence:
        value.observedEruptionStyleEvidence as readonly number[],
      knownEruptionStyleEvidenceFlags:
        value.knownEruptionStyleEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
