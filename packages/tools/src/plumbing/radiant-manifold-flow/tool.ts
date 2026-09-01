import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedManifoldPortLitersMinute: readonly number[];
  readonly manifoldPortEvidenceFlags: readonly number[];
  readonly observedIndependentHeaderLitersMinute: number;
}>;
export type Output = Readonly<{
  readonly knownPortFlowLitersMinute: number;
  readonly unknownPortCount: number;
  readonly signedHeaderMinusKnownPortsLitersMinute: number;
  readonly fullyObservedManifoldClosure: boolean;
}>;
const inputFields = [
  {
    id: "observedManifoldPortLitersMinute",
    label: "Observed manifold port liters minute",
    kind: "numberList",
  },
  {
    id: "manifoldPortEvidenceFlags",
    label: "Manifold port evidence flags",
    kind: "numberList",
  },
  {
    id: "observedIndependentHeaderLitersMinute",
    label: "Observed independent header liters minute",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedManifoldPortLitersMinute.forEach((v) =>
    nonnegative(v, "observedManifoldPortLitersMinute"),
  );
  nonnegative(
    input.observedIndependentHeaderLitersMinute,
    "observedIndependentHeaderLitersMinute",
  );
  binary(input.manifoldPortEvidenceFlags, "manifoldPortEvidenceFlags");
  aligned(
    input.observedManifoldPortLitersMinute,
    input.manifoldPortEvidenceFlags,
    "observedManifoldPortLitersMinute",
  );
  const known = sum(
      input.observedManifoldPortLitersMinute.filter(
        (_, i) => input.manifoldPortEvidenceFlags[i],
      ),
    ),
    unknown = input.manifoldPortEvidenceFlags.filter((v) => !v).length;
  return {
    knownPortFlowLitersMinute: known,
    unknownPortCount: unknown,
    signedHeaderMinusKnownPortsLitersMinute:
      input.observedIndependentHeaderLitersMinute - known,
    fullyObservedManifoldClosure: unknown === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedManifoldPortLitersMinute: [1, 2, 3],
  manifoldPortEvidenceFlags: [1, 0, 1],
  observedIndependentHeaderLitersMinute: 5,
} satisfies Input;
export const exampleOutput = {
  knownPortFlowLitersMinute: 4,
  unknownPortCount: 1,
  signedHeaderMinusKnownPortsLitersMinute: 1,
  fullyObservedManifoldClosure: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/radiant-manifold-flow",
  title: "Plumbing Radiant Manifold Flow Calculator",
  description:
    "Audit actual radiant manifold port evidence and independent header meter, preserving missing ports/signed closure discrepancy; not summing assumed zone demands or distributing flow equally.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownPortFlowLitersMinute",
      label: "Known port flow liters minute",
      kind: "number",
    },
    { id: "unknownPortCount", label: "Unknown port count", kind: "number" },
    {
      id: "signedHeaderMinusKnownPortsLitersMinute",
      label: "Signed header minus known ports liters minute",
      kind: "number",
    },
    {
      id: "fullyObservedManifoldClosure",
      label: "Fully observed manifold closure",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedManifoldPortLitersMinute:
        value.observedManifoldPortLitersMinute as readonly number[],
      manifoldPortEvidenceFlags:
        value.manifoldPortEvidenceFlags as readonly number[],
      observedIndependentHeaderLitersMinute:
        value.observedIndependentHeaderLitersMinute as number,
    }),
});
export const run = tool.execute;
export default tool;
