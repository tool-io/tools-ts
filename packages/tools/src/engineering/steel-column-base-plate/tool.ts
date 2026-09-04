import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly basePlateWidthM: number;
  readonly basePlateLengthM: number;
  readonly columnAxialLoadN: number;
  readonly signedMomentAboutWidthNm: number;
}>;
export type Output = Readonly<{
  readonly linearBasePlateEdgePressuresPa: readonly number[];
  readonly fullContactLinearBranch: boolean;
}>;
const inputFields = [
  { id: "basePlateWidthM", label: "Base plate width m", kind: "number" },
  { id: "basePlateLengthM", label: "Base plate length m", kind: "number" },
  { id: "columnAxialLoadN", label: "Column axial load n", kind: "number" },
  {
    id: "signedMomentAboutWidthNm",
    label: "Signed moment about width nm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.basePlateWidthM, "basePlateWidthM");
  positive(input.basePlateLengthM, "basePlateLengthM");
  nonnegative(input.columnAxialLoadN, "columnAxialLoadN");
  const average =
      input.columnAxialLoadN / input.basePlateWidthM / input.basePlateLengthM,
    edge =
      (6 * input.signedMomentAboutWidthNm) /
      (input.basePlateWidthM * input.basePlateLengthM ** 2),
    values = [average - edge, average + edge];
  return {
    linearBasePlateEdgePressuresPa: values,
    fullContactLinearBranch: Math.min(...values) >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  basePlateWidthM: 2,
  basePlateLengthM: 3,
  columnAxialLoadN: 12,
  signedMomentAboutWidthNm: 6,
} satisfies Input;
export const exampleOutput = {
  linearBasePlateEdgePressuresPa: [0, 4],
  fullContactLinearBranch: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/steel-column-base-plate",
  title: "Steel Column Base Plate Calculator",
  description:
    "Rigid full-contact base plate linear axial+bending pressure trial; negative edges explicitly invalidate assumed contact, no anchor/soil or plate sizing. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "linearBasePlateEdgePressuresPa",
      label: "Linear base plate edge pressures pa",
      kind: "numberList",
    },
    {
      id: "fullContactLinearBranch",
      label: "Full contact linear branch",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      basePlateWidthM: value.basePlateWidthM as number,
      basePlateLengthM: value.basePlateLengthM as number,
      columnAxialLoadN: value.columnAxialLoadN as number,
      signedMomentAboutWidthNm: value.signedMomentAboutWidthNm as number,
    }),
});
export const run = tool.execute;
export default tool;
