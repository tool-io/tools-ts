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
  readonly callerDepressionOriginClassIds: readonly string[];
  readonly callerDepressionOriginRequiredEvidence: readonly (readonly number[])[];
  readonly observedDepressionOriginEvidence: readonly number[];
  readonly knownDepressionOriginEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly contradictionFreeCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerDepressionOriginClassIds",
    label: "Caller depression origin class ids",
    kind: "stringList",
  },
  {
    id: "callerDepressionOriginRequiredEvidence",
    label: "Caller depression origin required evidence",
    kind: "matrix",
  },
  {
    id: "observedDepressionOriginEvidence",
    label: "Observed depression origin evidence",
    kind: "numberList",
  },
  {
    id: "knownDepressionOriginEvidenceFlags",
    label: "Known depression origin evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.observedDepressionOriginEvidence,
    "observedDepressionOriginEvidence",
  );
  binary(
    input.knownDepressionOriginEvidenceFlags,
    "knownDepressionOriginEvidenceFlags",
  );
  aligned(
    input.observedDepressionOriginEvidence,
    input.knownDepressionOriginEvidenceFlags,
    "observedDepressionOriginEvidence",
  );
  aligned(
    input.callerDepressionOriginClassIds,
    input.callerDepressionOriginRequiredEvidence,
    "callerDepressionOriginClassIds",
  );
  unique(input.callerDepressionOriginClassIds, "classes");
  if (
    input.callerDepressionOriginRequiredEvidence.some((row) =>
      row.every((v) => v === 0),
    )
  )
    simpleError(
      "criteria",
      "Every caller class requires at least one positive evidence witness.",
    );
  if (
    shape(input.callerDepressionOriginRequiredEvidence, "requirements") !==
    input.observedDepressionOriginEvidence.length
  )
    simpleError(
      "criteria",
      "Caller one binary requirement per evidence column.",
    );
  input.callerDepressionOriginRequiredEvidence.forEach((row) =>
    row.forEach((v) => {
      if (v !== 0 && v !== 1)
        simpleError("criteria", "Binary positive evidence requirements.");
    }),
  );
  const compatible = input.callerDepressionOriginClassIds.filter((_, i) =>
      input.callerDepressionOriginRequiredEvidence[i].every(
        (v, j) =>
          !v ||
          !input.knownDepressionOriginEvidenceFlags[j] ||
          input.observedDepressionOriginEvidence[j] === 1,
      ),
    ),
    complete = input.callerDepressionOriginClassIds.filter((_, i) =>
      input.callerDepressionOriginRequiredEvidence[i].every(
        (v, j) =>
          !v ||
          (input.knownDepressionOriginEvidenceFlags[j] === 1 &&
            input.observedDepressionOriginEvidence[j] === 1),
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
  callerDepressionOriginClassIds: ["class-a", "class-b"],
  callerDepressionOriginRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedDepressionOriginEvidence: [1, 0],
  knownDepressionOriginEvidenceFlags: [1, 0],
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
  id: "volcanology/caldera-vs-summit-crater-classifier",
  title: "Caldera vs Summit Crater Classifier",
  description:
    "Screen independently mapped collapse versus excavation/vent evidence for caller caldera/crater definitions, no diameter-only identity. Positive caller evidence rules only; missing evidence retains compatible possibilities, overlaps not forced to one identity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      callerDepressionOriginClassIds:
        value.callerDepressionOriginClassIds as readonly string[],
      callerDepressionOriginRequiredEvidence:
        value.callerDepressionOriginRequiredEvidence as readonly (readonly number[])[],
      observedDepressionOriginEvidence:
        value.observedDepressionOriginEvidence as readonly number[],
      knownDepressionOriginEvidenceFlags:
        value.knownDepressionOriginEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
