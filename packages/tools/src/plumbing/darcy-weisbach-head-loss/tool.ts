import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerIndependentDarcyFrictionFactor: number;
  readonly actualPipeLengthMeters: number;
  readonly actualInnerDiameterMeters: number;
  readonly actualMeanVelocityMetersPerSecond: number;
  readonly callerGravityMetersPerSecondSquared: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentDarcyFrictionFactor",
    label: "Caller independent darcy friction factor",
    kind: "number",
  },
  {
    id: "actualPipeLengthMeters",
    label: "Actual pipe length meters",
    kind: "number",
  },
  {
    id: "actualInnerDiameterMeters",
    label: "Actual inner diameter meters",
    kind: "number",
  },
  {
    id: "actualMeanVelocityMetersPerSecond",
    label: "Actual mean velocity meters per second",
    kind: "number",
  },
  {
    id: "callerGravityMetersPerSecondSquared",
    label: "Caller gravity meters per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerIndependentDarcyFrictionFactor,
    "callerIndependentDarcyFrictionFactor",
  );
  nonnegative(input.actualPipeLengthMeters, "actualPipeLengthMeters");
  positive(input.actualInnerDiameterMeters, "actualInnerDiameterMeters");
  nonnegative(
    input.actualMeanVelocityMetersPerSecond,
    "actualMeanVelocityMetersPerSecond",
  );
  positive(
    input.callerGravityMetersPerSecondSquared,
    "callerGravityMetersPerSecondSquared",
  );
  return {
    value:
      (((input.callerIndependentDarcyFrictionFactor *
        input.actualPipeLengthMeters) /
        input.actualInnerDiameterMeters) *
        input.actualMeanVelocityMetersPerSecond ** 2) /
      (2 * input.callerGravityMetersPerSecondSquared),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentDarcyFrictionFactor: 0.5,
    actualPipeLengthMeters: 2,
    actualInnerDiameterMeters: 1,
    actualMeanVelocityMetersPerSecond: 2,
    callerGravityMetersPerSecondSquared: 2,
  },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/darcy-weisbach-head-loss",
  title: "Plumbing Darcy Weisbach Head Loss Calculator",
  description:
    "Darcy\u2013Weisbach HEAD loss fL/d v\u00b2/(2g), actual Darcy\u2014notFanning\u2014factor; not pressurePa output or friction regime determination. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
