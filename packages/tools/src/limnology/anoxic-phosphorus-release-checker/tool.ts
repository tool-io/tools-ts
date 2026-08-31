import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedSedimentInterfaceOxygenMgLiter: readonly number[];
  readonly oxygenEvidenceFlags: readonly number[];
  readonly labilePhosphorusEvidenceFlags: readonly number[];
  readonly callerAnoxiaOxygenCeilingMgLiter: number;
}>;
export type Output = Readonly<{
  readonly callerAnoxicReleaseCandidateIndices: readonly number[];
  readonly oxygenEvidenceUnknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSedimentInterfaceOxygenMgLiter",
    label: "Observed sediment interface oxygen mg liter",
    kind: "numberList",
  },
  {
    id: "oxygenEvidenceFlags",
    label: "Oxygen evidence flags",
    kind: "numberList",
  },
  {
    id: "labilePhosphorusEvidenceFlags",
    label: "Labile phosphorus evidence flags",
    kind: "numberList",
  },
  {
    id: "callerAnoxiaOxygenCeilingMgLiter",
    label: "Caller anoxia oxygen ceiling mg liter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSedimentInterfaceOxygenMgLiter.forEach((v) =>
    nonnegative(v, "observedSedimentInterfaceOxygenMgLiter"),
  );
  nonnegative(
    input.callerAnoxiaOxygenCeilingMgLiter,
    "callerAnoxiaOxygenCeilingMgLiter",
  );
  binary(input.oxygenEvidenceFlags, "oxygenEvidenceFlags");
  binary(input.labilePhosphorusEvidenceFlags, "labilePhosphorusEvidenceFlags");
  aligned(
    input.observedSedimentInterfaceOxygenMgLiter,
    input.oxygenEvidenceFlags,
    "observedSedimentInterfaceOxygenMgLiter",
  );
  aligned(
    input.observedSedimentInterfaceOxygenMgLiter,
    input.labilePhosphorusEvidenceFlags,
    "observedSedimentInterfaceOxygenMgLiter",
  );
  return {
    callerAnoxicReleaseCandidateIndices:
      input.observedSedimentInterfaceOxygenMgLiter.flatMap((v, i) =>
        input.oxygenEvidenceFlags[i] &&
        input.labilePhosphorusEvidenceFlags[i] &&
        v <= input.callerAnoxiaOxygenCeilingMgLiter
          ? [i]
          : [],
      ),
    oxygenEvidenceUnknownIndices: input.oxygenEvidenceFlags.flatMap((v, i) =>
      !v ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSedimentInterfaceOxygenMgLiter: [0, 1, 0],
  oxygenEvidenceFlags: [1, 1, 0],
  labilePhosphorusEvidenceFlags: [1, 0, 1],
  callerAnoxiaOxygenCeilingMgLiter: 0.5,
} satisfies Input;
export const exampleOutput = {
  callerAnoxicReleaseCandidateIndices: [0],
  oxygenEvidenceUnknownIndices: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/anoxic-phosphorus-release-checker",
  title: "Anoxic Phosphorus Release Checker",
  description:
    "Screen actual sediment-interface low-oxygen and caller labile-P evidence jointly; candidates are not measured release, universal redox mechanism, inferred missing oxygen or remediation advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerAnoxicReleaseCandidateIndices",
      label: "Caller anoxic release candidate indices",
      kind: "numberList",
    },
    {
      id: "oxygenEvidenceUnknownIndices",
      label: "Oxygen evidence unknown indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSedimentInterfaceOxygenMgLiter:
        value.observedSedimentInterfaceOxygenMgLiter as readonly number[],
      oxygenEvidenceFlags: value.oxygenEvidenceFlags as readonly number[],
      labilePhosphorusEvidenceFlags:
        value.labilePhosphorusEvidenceFlags as readonly number[],
      callerAnoxiaOxygenCeilingMgLiter:
        value.callerAnoxiaOxygenCeilingMgLiter as number,
    }),
});
export const run = tool.execute;
export default tool;
