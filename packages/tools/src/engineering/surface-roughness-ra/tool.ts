import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, profileRa } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly profileStationsM: readonly number[];
  readonly measuredProfileHeightsM: readonly number[];
}>;
export type Output = Readonly<{ readonly piecewiseLinearProfileRaM: number }>;
const inputFields = [
  { id: "profileStationsM", label: "Profile stations m", kind: "numberList" },
  {
    id: "measuredProfileHeightsM",
    label: "Measured profile heights m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    piecewiseLinearProfileRaM: profileRa(
      input.profileStationsM,
      input.measuredProfileHeightsM,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  profileStationsM: [0, 1, 2],
  measuredProfileHeightsM: [-1, 1, -1],
} satisfies Input;
export const exampleOutput = {
  piecewiseLinearProfileRaM: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/surface-roughness-ra",
  title: "Surface Roughness Ra Calculator",
  description:
    "Integrate actual unequal-station piecewise-linear absolute profile deviation from its length-weighted mean, not arithmetic sample absolute deviation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "piecewiseLinearProfileRaM",
      label: "Piecewise linear profile ra m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      profileStationsM: value.profileStationsM as readonly number[],
      measuredProfileHeightsM:
        value.measuredProfileHeightsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
