import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly measuredEyeHeightCm: number;
  readonly currentDocumentCenterHeightCm: number;
  readonly currentDocumentHorizontalDistanceCm: number;
  readonly proposedDocumentCenterHeightCm: number;
  readonly proposedDocumentHorizontalDistanceCm: number;
}>;
export type Output = Readonly<{
  readonly currentDownwardSightlineDegrees: number;
  readonly proposedDownwardSightlineDegrees: number;
  readonly signedDownwardSightlineReductionDegrees: number;
}>;
const inputFields = [
  {
    id: "measuredEyeHeightCm",
    label: "Measured eye height cm",
    kind: "number",
  },
  {
    id: "currentDocumentCenterHeightCm",
    label: "Current document center height cm",
    kind: "number",
  },
  {
    id: "currentDocumentHorizontalDistanceCm",
    label: "Current document horizontal distance cm",
    kind: "number",
  },
  {
    id: "proposedDocumentCenterHeightCm",
    label: "Proposed document center height cm",
    kind: "number",
  },
  {
    id: "proposedDocumentHorizontalDistanceCm",
    label: "Proposed document horizontal distance cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.currentDocumentHorizontalDistanceCm,
    "currentDocumentHorizontalDistanceCm",
  );
  positive(
    input.proposedDocumentHorizontalDistanceCm,
    "proposedDocumentHorizontalDistanceCm",
  );
  nonnegative(input.measuredEyeHeightCm, "measuredEyeHeightCm");
  nonnegative(
    input.currentDocumentCenterHeightCm,
    "currentDocumentCenterHeightCm",
  );
  nonnegative(
    input.proposedDocumentCenterHeightCm,
    "proposedDocumentCenterHeightCm",
  );
  const current =
      (Math.atan2(
        input.measuredEyeHeightCm - input.currentDocumentCenterHeightCm,
        input.currentDocumentHorizontalDistanceCm,
      ) *
        180) /
      Math.PI,
    proposed =
      (Math.atan2(
        input.measuredEyeHeightCm - input.proposedDocumentCenterHeightCm,
        input.proposedDocumentHorizontalDistanceCm,
      ) *
        180) /
      Math.PI;
  return {
    currentDownwardSightlineDegrees: current,
    proposedDownwardSightlineDegrees: proposed,
    signedDownwardSightlineReductionDegrees: current - proposed,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredEyeHeightCm: 120,
  currentDocumentCenterHeightCm: 90,
  currentDocumentHorizontalDistanceCm: 50,
  proposedDocumentCenterHeightCm: 110,
  proposedDocumentHorizontalDistanceCm: 50,
} satisfies Input;
export const exampleOutput = {
  currentDownwardSightlineDegrees: 30.96375653207352,
  proposedDownwardSightlineDegrees: 11.309932474020213,
  signedDownwardSightlineReductionDegrees: 19.653824058053306,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/document-holder-neck-checker",
  title: "Document Holder Angle Neck Flexion Reducer Checker",
  description:
    "Compare actual document-center sightline geometries preserving upward/downward sign and worsening changes; sightline is not measured neck flexion or guaranteed neck-load reduction.",
  inputs: inputFields,
  outputs: [
    {
      id: "currentDownwardSightlineDegrees",
      label: "Current downward sightline degrees",
      kind: "number",
    },
    {
      id: "proposedDownwardSightlineDegrees",
      label: "Proposed downward sightline degrees",
      kind: "number",
    },
    {
      id: "signedDownwardSightlineReductionDegrees",
      label: "Signed downward sightline reduction degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredEyeHeightCm: value.measuredEyeHeightCm as number,
      currentDocumentCenterHeightCm:
        value.currentDocumentCenterHeightCm as number,
      currentDocumentHorizontalDistanceCm:
        value.currentDocumentHorizontalDistanceCm as number,
      proposedDocumentCenterHeightCm:
        value.proposedDocumentCenterHeightCm as number,
      proposedDocumentHorizontalDistanceCm:
        value.proposedDocumentHorizontalDistanceCm as number,
    }),
});
export const run = tool.execute;
export default tool;
