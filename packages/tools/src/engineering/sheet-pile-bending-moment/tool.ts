import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  strictlyIncreasing,
  finite,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly sheetStationsM: readonly number[];
  readonly callerNetLateralLineLoadsNM: readonly number[];
  readonly callerTopShearN: number;
  readonly callerTopMomentNm: number;
}>;
export type Output = Readonly<{
  readonly sheetSectionShearsN: readonly number[];
  readonly sheetSectionMomentsNm: readonly number[];
}>;
const inputFields = [
  { id: "sheetStationsM", label: "Sheet stations m", kind: "numberList" },
  {
    id: "callerNetLateralLineLoadsNM",
    label: "Caller net lateral line loads n m",
    kind: "numberList",
  },
  { id: "callerTopShearN", label: "Caller top shear n", kind: "number" },
  { id: "callerTopMomentNm", label: "Caller top moment nm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.sheetStationsM, input.callerNetLateralLineLoadsNM, "profile");
  strictlyIncreasing(input.sheetStationsM, "stations");
  let shear = input.callerTopShearN,
    moment = input.callerTopMomentNm;
  const shears = [shear],
    moments = [moment];
  for (let i = 1; i < input.sheetStationsM.length; i++) {
    const dx = input.sheetStationsM[i] - input.sheetStationsM[i - 1],
      a = input.callerNetLateralLineLoadsNM[i - 1],
      b = input.callerNetLateralLineLoadsNM[i];
    moment = finite(moment + shear * dx + dx * dx * (a / 3 + b / 6));
    shear = finite(shear + dx * (a / 2 + b / 2));
    shears.push(shear);
    moments.push(moment);
  }
  return { sheetSectionShearsN: shears, sheetSectionMomentsNm: moments };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sheetStationsM: [0, 1, 2],
  callerNetLateralLineLoadsNM: [2, 2, 2],
  callerTopShearN: -2,
  callerTopMomentNm: 0,
} satisfies Input;
export const exampleOutput = {
  sheetSectionShearsN: [-2, 0, 2],
  sheetSectionMomentsNm: [0, -1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/sheet-pile-bending-moment",
  title: "Sheet Pile Bending Moment Calculator",
  description:
    "Integrate actual caller signed net lateral load with explicit boundary shear/moment, exact piecewise-linear loading within each interval; no earth pressure/support design inference. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "sheetSectionShearsN",
      label: "Sheet section shears n",
      kind: "numberList",
    },
    {
      id: "sheetSectionMomentsNm",
      label: "Sheet section moments nm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      sheetStationsM: value.sheetStationsM as readonly number[],
      callerNetLateralLineLoadsNM:
        value.callerNetLateralLineLoadsNM as readonly number[],
      callerTopShearN: value.callerTopShearN as number,
      callerTopMomentNm: value.callerTopMomentNm as number,
    }),
});
export const run = tool.execute;
export default tool;
