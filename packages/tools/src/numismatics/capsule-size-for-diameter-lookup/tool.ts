import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  unique,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerCapsuleIds: readonly string[];
  readonly callerVerifiedUsableInnerDiametersMm: readonly number[];
  readonly callerVerifiedUsableInnerDepthsMm: readonly number[];
  readonly observedMaximumCoinDiameterMm: number;
  readonly observedMaximumCoinReliefThicknessMm: number;
  readonly callerRequiredDiametralClearanceMm: number;
  readonly callerRequiredAxialClearanceMm: number;
}>;
export type Output = Readonly<{
  readonly callerDimensionCompatibleCapsuleIds: readonly string[];
  readonly signedDiametralClearanceMarginsMm: readonly number[];
  readonly signedAxialClearanceMarginsMm: readonly number[];
}>;
const inputFields = [
  { id: "callerCapsuleIds", label: "Caller capsule ids", kind: "stringList" },
  {
    id: "callerVerifiedUsableInnerDiametersMm",
    label: "Caller verified usable inner diameters mm",
    kind: "numberList",
  },
  {
    id: "callerVerifiedUsableInnerDepthsMm",
    label: "Caller verified usable inner depths mm",
    kind: "numberList",
  },
  {
    id: "observedMaximumCoinDiameterMm",
    label: "Observed maximum coin diameter mm",
    kind: "number",
  },
  {
    id: "observedMaximumCoinReliefThicknessMm",
    label: "Observed maximum coin relief thickness mm",
    kind: "number",
  },
  {
    id: "callerRequiredDiametralClearanceMm",
    label: "Caller required diametral clearance mm",
    kind: "number",
  },
  {
    id: "callerRequiredAxialClearanceMm",
    label: "Caller required axial clearance mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedUsableInnerDiametersMm.forEach((v) =>
    positive(v, "callerVerifiedUsableInnerDiametersMm"),
  );
  input.callerVerifiedUsableInnerDepthsMm.forEach((v) =>
    positive(v, "callerVerifiedUsableInnerDepthsMm"),
  );
  positive(
    input.observedMaximumCoinDiameterMm,
    "observedMaximumCoinDiameterMm",
  );
  positive(
    input.observedMaximumCoinReliefThicknessMm,
    "observedMaximumCoinReliefThicknessMm",
  );
  nonnegative(
    input.callerRequiredDiametralClearanceMm,
    "callerRequiredDiametralClearanceMm",
  );
  nonnegative(
    input.callerRequiredAxialClearanceMm,
    "callerRequiredAxialClearanceMm",
  );
  aligned(
    input.callerCapsuleIds,
    input.callerVerifiedUsableInnerDiametersMm,
    "callerCapsuleIds",
  );
  aligned(
    input.callerCapsuleIds,
    input.callerVerifiedUsableInnerDepthsMm,
    "callerCapsuleIds",
  );
  unique(input.callerCapsuleIds, "capsules");
  const diameters = input.callerVerifiedUsableInnerDiametersMm.map(
      (v) =>
        v -
        input.observedMaximumCoinDiameterMm -
        input.callerRequiredDiametralClearanceMm,
    ),
    depths = input.callerVerifiedUsableInnerDepthsMm.map(
      (v) =>
        v -
        input.observedMaximumCoinReliefThicknessMm -
        input.callerRequiredAxialClearanceMm,
    );
  return {
    callerDimensionCompatibleCapsuleIds: input.callerCapsuleIds.filter(
      (_, i) => diameters[i] >= 0 && depths[i] >= 0,
    ),
    signedDiametralClearanceMarginsMm: diameters,
    signedAxialClearanceMarginsMm: depths,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCapsuleIds: ["a", "b", "c"],
  callerVerifiedUsableInnerDiametersMm: [20, 22, 25],
  callerVerifiedUsableInnerDepthsMm: [3, 2, 4],
  observedMaximumCoinDiameterMm: 21,
  observedMaximumCoinReliefThicknessMm: 3,
  callerRequiredDiametralClearanceMm: 1,
  callerRequiredAxialClearanceMm: 0.5,
} satisfies Input;
export const exampleOutput = {
  callerDimensionCompatibleCapsuleIds: ["c"],
  signedDiametralClearanceMarginsMm: [-2, 0, 3],
  signedAxialClearanceMarginsMm: [-0.5, -1.5, 0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/capsule-size-for-diameter-lookup",
  title: "Capsule Size for Diameter Lookup",
  description:
    "Screen actual capsule catalogs against measured maximum coin diameter/relief and explicit independent diametral/axial clearances; not vertical tube stacking, invented trade sizes or chemical/storage conservation approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerDimensionCompatibleCapsuleIds",
      label: "Caller dimension compatible capsule ids",
      kind: "stringList",
    },
    {
      id: "signedDiametralClearanceMarginsMm",
      label: "Signed diametral clearance margins mm",
      kind: "numberList",
    },
    {
      id: "signedAxialClearanceMarginsMm",
      label: "Signed axial clearance margins mm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCapsuleIds: value.callerCapsuleIds as readonly string[],
      callerVerifiedUsableInnerDiametersMm:
        value.callerVerifiedUsableInnerDiametersMm as readonly number[],
      callerVerifiedUsableInnerDepthsMm:
        value.callerVerifiedUsableInnerDepthsMm as readonly number[],
      observedMaximumCoinDiameterMm:
        value.observedMaximumCoinDiameterMm as number,
      observedMaximumCoinReliefThicknessMm:
        value.observedMaximumCoinReliefThicknessMm as number,
      callerRequiredDiametralClearanceMm:
        value.callerRequiredDiametralClearanceMm as number,
      callerRequiredAxialClearanceMm:
        value.callerRequiredAxialClearanceMm as number,
    }),
});
export const run = tool.execute;
export default tool;
