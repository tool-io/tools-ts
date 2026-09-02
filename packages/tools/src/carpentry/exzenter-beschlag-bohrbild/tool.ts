import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedCamBoreDepthsMm: readonly number[];
  readonly observedCamActualBoreDepthsMm: readonly number[];
  readonly observedCamAxialMaterialThicknessMm: readonly number[];
  readonly callerVerifiedCamDepthToleranceMm: number;
}>;
export type Output = Readonly<{
  readonly signedCamBoreDepthDeviationsMm: readonly number[];
  readonly observedRemainingCamWebMm: readonly number[];
  readonly camDepthReviewIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerVerifiedCamBoreDepthsMm",
    label: "Caller verified cam bore depths mm",
    kind: "numberList",
  },
  {
    id: "observedCamActualBoreDepthsMm",
    label: "Observed cam actual bore depths mm",
    kind: "numberList",
  },
  {
    id: "observedCamAxialMaterialThicknessMm",
    label: "Observed cam axial material thickness mm",
    kind: "numberList",
  },
  {
    id: "callerVerifiedCamDepthToleranceMm",
    label: "Caller verified cam depth tolerance mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCamAxialMaterialThicknessMm.forEach((v) =>
    positive(v, "observedCamAxialMaterialThicknessMm"),
  );
  input.callerVerifiedCamBoreDepthsMm.forEach((v) =>
    nonnegative(v, "callerVerifiedCamBoreDepthsMm"),
  );
  input.observedCamActualBoreDepthsMm.forEach((v) =>
    nonnegative(v, "observedCamActualBoreDepthsMm"),
  );
  nonnegative(
    input.callerVerifiedCamDepthToleranceMm,
    "callerVerifiedCamDepthToleranceMm",
  );
  aligned(
    input.callerVerifiedCamBoreDepthsMm,
    input.observedCamActualBoreDepthsMm,
    "callerVerifiedCamBoreDepthsMm",
  );
  aligned(
    input.callerVerifiedCamBoreDepthsMm,
    input.observedCamAxialMaterialThicknessMm,
    "callerVerifiedCamBoreDepthsMm",
  );
  const delta = input.observedCamActualBoreDepthsMm.map(
    (v, i) => v - input.callerVerifiedCamBoreDepthsMm[i],
  );
  return {
    signedCamBoreDepthDeviationsMm: delta,
    observedRemainingCamWebMm: input.observedCamAxialMaterialThicknessMm.map(
      (v, i) => v - input.observedCamActualBoreDepthsMm[i],
    ),
    camDepthReviewIndices: delta.flatMap((v, i) =>
      Math.abs(v) > input.callerVerifiedCamDepthToleranceMm ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedCamBoreDepthsMm: [10, 12],
  observedCamActualBoreDepthsMm: [11, 10],
  observedCamAxialMaterialThicknessMm: [20, 20],
  callerVerifiedCamDepthToleranceMm: 0.5,
} satisfies Input;
export const exampleOutput = {
  signedCamBoreDepthDeviationsMm: [1, -2],
  observedRemainingCamWebMm: [9, 10],
  camDepthReviewIndices: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/exzenter-beschlag-bohrbild",
  title: "Exzenter Beschlag Bohrbild Calculator",
  description:
    "Audit actual eccentric-cam bore depths against independently verified hardware pattern/depth tolerance and axial web inventory, no manufacturer dimensions or drilling procedure invented. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedCamBoreDepthDeviationsMm",
      label: "Signed cam bore depth deviations mm",
      kind: "numberList",
    },
    {
      id: "observedRemainingCamWebMm",
      label: "Observed remaining cam web mm",
      kind: "numberList",
    },
    {
      id: "camDepthReviewIndices",
      label: "Cam depth review indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedCamBoreDepthsMm:
        value.callerVerifiedCamBoreDepthsMm as readonly number[],
      observedCamActualBoreDepthsMm:
        value.observedCamActualBoreDepthsMm as readonly number[],
      observedCamAxialMaterialThicknessMm:
        value.observedCamAxialMaterialThicknessMm as readonly number[],
      callerVerifiedCamDepthToleranceMm:
        value.callerVerifiedCamDepthToleranceMm as number,
    }),
});
export const run = tool.execute;
export default tool;
