import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly snowMassLoadsKg: readonly number[];
  readonly loadLeverArmsM: readonly number[];
  readonly stemDiametersM: readonly number[];
  readonly gravityMPerSecondSquared: number;
  readonly callerAllowableBendingStressPa: readonly number[];
}>;
export type Output = Readonly<{
  readonly modelStemBendingStressesPa: readonly number[];
  readonly aboveCallerStressFlags: readonly number[];
}>;
const inputFields = [
  { id: "snowMassLoadsKg", label: "Snow mass loads kg", kind: "numberList" },
  { id: "loadLeverArmsM", label: "Load lever arms m", kind: "numberList" },
  { id: "stemDiametersM", label: "Stem diameters m", kind: "numberList" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  {
    id: "callerAllowableBendingStressPa",
    label: "Caller allowable bending stress pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.stemDiametersM.forEach((v) => positive(v, "stemDiametersM"));
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  input.callerAllowableBendingStressPa.forEach((v) =>
    positive(v, "callerAllowableBendingStressPa"),
  );
  input.snowMassLoadsKg.forEach((v) => nonnegative(v, "snowMassLoadsKg"));
  input.loadLeverArmsM.forEach((v) => nonnegative(v, "loadLeverArmsM"));
  aligned(input.snowMassLoadsKg, input.loadLeverArmsM, "snowMassLoadsKg");
  aligned(input.snowMassLoadsKg, input.stemDiametersM, "snowMassLoadsKg");
  aligned(
    input.snowMassLoadsKg,
    input.callerAllowableBendingStressPa,
    "snowMassLoadsKg",
  );
  const modelStemBendingStressesPa = input.snowMassLoadsKg.map(
    (m, i) =>
      (32 * m * input.gravityMPerSecondSquared * input.loadLeverArmsM[i]) /
      (Math.PI * input.stemDiametersM[i] ** 3),
  );
  return {
    modelStemBendingStressesPa,
    aboveCallerStressFlags: modelStemBendingStressesPa.map((v, i) =>
      v > input.callerAllowableBendingStressPa[i] ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  snowMassLoadsKg: [10, 20],
  loadLeverArmsM: [1, 2],
  stemDiametersM: [0.1, 0.2],
  gravityMPerSecondSquared: 10,
  callerAllowableBendingStressPa: [1000000, 1000000],
} satisfies Input;
export const exampleOutput = {
  modelStemBendingStressesPa: [1018591.6357881302, 509295.8178940651],
  aboveCallerStressFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/snow-load-breakage-critical-stem-bending-stress",
  title: "Snow Load Stem Bending Stress Breakage Checker",
  description:
    "Screen circular intact stem cantilever bending under caller transverse snow-weight lever arms and material stress limits; this elementary idealization does not predict tree breakage or certify public/work safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelStemBendingStressesPa",
      label: "Model stem bending stresses pa",
      kind: "numberList",
    },
    {
      id: "aboveCallerStressFlags",
      label: "Above caller stress flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      snowMassLoadsKg: value.snowMassLoadsKg as readonly number[],
      loadLeverArmsM: value.loadLeverArmsM as readonly number[],
      stemDiametersM: value.stemDiametersM as readonly number[],
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      callerAllowableBendingStressPa:
        value.callerAllowableBendingStressPa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
