import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAttachmentPointNames: readonly string[];
  readonly callerVerifiedOffsetsFromHeelInches: readonly number[];
  readonly observedAttachmentOffsetsInches: readonly number[];
  readonly callerPlacementToleranceInches: number;
}>;
export type Output = Readonly<{
  readonly signedObservedMinusVerifiedOffsetsInches: readonly number[];
  readonly attachmentsOutsideCallerPlacementTolerance: readonly string[];
}>;
const inputFields = [
  {
    id: "callerVerifiedAttachmentPointNames",
    label: "Caller verified attachment point names",
    kind: "stringList",
  },
  {
    id: "callerVerifiedOffsetsFromHeelInches",
    label: "Caller verified offsets from heel inches",
    kind: "numberList",
  },
  {
    id: "observedAttachmentOffsetsInches",
    label: "Observed attachment offsets inches",
    kind: "numberList",
  },
  {
    id: "callerPlacementToleranceInches",
    label: "Caller placement tolerance inches",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedOffsetsFromHeelInches.forEach((v) =>
    nonnegative(v, "callerVerifiedOffsetsFromHeelInches"),
  );
  input.observedAttachmentOffsetsInches.forEach((v) =>
    nonnegative(v, "observedAttachmentOffsetsInches"),
  );
  nonnegative(
    input.callerPlacementToleranceInches,
    "callerPlacementToleranceInches",
  );
  aligned(
    input.callerVerifiedAttachmentPointNames,
    input.callerVerifiedOffsetsFromHeelInches,
    "callerVerifiedAttachmentPointNames",
  );
  aligned(
    input.callerVerifiedAttachmentPointNames,
    input.observedAttachmentOffsetsInches,
    "callerVerifiedAttachmentPointNames",
  );
  unique(input.callerVerifiedAttachmentPointNames, "attachments");
  const d = input.observedAttachmentOffsetsInches.map(
    (v, i) => v - input.callerVerifiedOffsetsFromHeelInches[i],
  );
  return {
    signedObservedMinusVerifiedOffsetsInches: d,
    attachmentsOutsideCallerPlacementTolerance:
      input.callerVerifiedAttachmentPointNames.filter(
        (_, i) => Math.abs(d[i]) > input.callerPlacementToleranceInches,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAttachmentPointNames: ["ribbon", "elastic"],
  callerVerifiedOffsetsFromHeelInches: [1, 2],
  observedAttachmentOffsetsInches: [1.1, 2.5],
  callerPlacementToleranceInches: 0.2,
} satisfies Input;
export const exampleOutput = {
  signedObservedMinusVerifiedOffsetsInches: [0.1, 0.5],
  attachmentsOutsideCallerPlacementTolerance: ["elastic"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/shoe-ribbon-elastic-sewing-placement-inch-lookup",
  title: "Shoe Ribbon Elastic Sewing Placement Inch Lookup",
  description:
    "Audit actual shoe ribbon/elastic attachment marks against independently verified caller same-shoe placement reference; not universal inches, sewing instructions, fit diagnosis or pointe readiness.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedObservedMinusVerifiedOffsetsInches",
      label: "Signed observed minus verified offsets inches",
      kind: "numberList",
    },
    {
      id: "attachmentsOutsideCallerPlacementTolerance",
      label: "Attachments outside caller placement tolerance",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedAttachmentPointNames:
        value.callerVerifiedAttachmentPointNames as readonly string[],
      callerVerifiedOffsetsFromHeelInches:
        value.callerVerifiedOffsetsFromHeelInches as readonly number[],
      observedAttachmentOffsetsInches:
        value.observedAttachmentOffsetsInches as readonly number[],
      callerPlacementToleranceInches:
        value.callerPlacementToleranceInches as number,
    }),
});
export const run = tool.execute;
export default tool;
