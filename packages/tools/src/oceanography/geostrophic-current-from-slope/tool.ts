import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedHeightGradientX: number;
  readonly observedHeightGradientY: number;
  readonly callerCoriolisPerSecond: number;
  readonly gravityMSecond2: number;
}>;
export type Output = Readonly<{
  readonly geostrophicVelocityXMSecond: number;
  readonly geostrophicVelocityYMSecond: number;
}>;
const inputFields = [
  {
    id: "observedHeightGradientX",
    label: "Observed height gradient x",
    kind: "number",
  },
  {
    id: "observedHeightGradientY",
    label: "Observed height gradient y",
    kind: "number",
  },
  {
    id: "callerCoriolisPerSecond",
    label: "Caller coriolis per second",
    kind: "number",
  },
  { id: "gravityMSecond2", label: "Gravity m second2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.gravityMSecond2, "gravityMSecond2");
  if (input.callerCoriolisPerSecond === 0)
    simpleError(
      "f",
      "Nonzero independently established Coriolis parameter, no equatorial geostrophy.",
    );
  return {
    geostrophicVelocityXMSecond:
      (-input.gravityMSecond2 / input.callerCoriolisPerSecond) *
      input.observedHeightGradientY,
    geostrophicVelocityYMSecond:
      (input.gravityMSecond2 / input.callerCoriolisPerSecond) *
      input.observedHeightGradientX,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHeightGradientX: 1e-6,
  observedHeightGradientY: 2e-6,
  callerCoriolisPerSecond: 0.0001,
  gravityMSecond2: 10,
} satisfies Input;
export const exampleOutput = {
  geostrophicVelocityXMSecond: -0.2,
  geostrophicVelocityYMSecond: 0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/geostrophic-current-from-slope",
  title: "Geostrophic Current From Slope Calculator",
  description:
    "Signed two-component geostrophic surface slope relation with callerf, x/y local axes and balanced regime explicit; not coordinate conversion. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "geostrophicVelocityXMSecond",
      label: "Geostrophic velocity x m second",
      kind: "number",
    },
    {
      id: "geostrophicVelocityYMSecond",
      label: "Geostrophic velocity y m second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHeightGradientX: value.observedHeightGradientX as number,
      observedHeightGradientY: value.observedHeightGradientY as number,
      callerCoriolisPerSecond: value.callerCoriolisPerSecond as number,
      gravityMSecond2: value.gravityMSecond2 as number,
    }),
});
export const run = tool.execute;
export default tool;
