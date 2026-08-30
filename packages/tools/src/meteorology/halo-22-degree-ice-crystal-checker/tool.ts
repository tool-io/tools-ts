import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly relativeIceRefractiveIndex: number;
  readonly observedHaloRadiusDegrees: number;
  readonly callerAngularToleranceDegrees: number;
}>;
export type Output = Readonly<{
  readonly hexagonalPrismMinimumDeviationDegrees: number;
  readonly observedMinusPrismAngleDegrees: number;
  readonly withinCallerAngularTolerance: boolean;
}>;
const inputFields = [
  {
    id: "relativeIceRefractiveIndex",
    label: "Relative ice refractive index",
    kind: "number",
  },
  {
    id: "observedHaloRadiusDegrees",
    label: "Observed halo radius degrees",
    kind: "number",
  },
  {
    id: "callerAngularToleranceDegrees",
    label: "Caller angular tolerance degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.relativeIceRefractiveIndex, "relativeIceRefractiveIndex");
  nonnegative(input.observedHaloRadiusDegrees, "observedHaloRadiusDegrees");
  nonnegative(
    input.callerAngularToleranceDegrees,
    "callerAngularToleranceDegrees",
  );
  if (
    input.relativeIceRefractiveIndex <= 1 ||
    input.relativeIceRefractiveIndex >= 2
  )
    simpleError(
      "index",
      "Transmitting 60-degree-prism relative index in (1,2) required.",
    );
  const hexagonalPrismMinimumDeviationDegrees =
      (2 * Math.asin(input.relativeIceRefractiveIndex / 2) * 180) / Math.PI -
      60,
    observedMinusPrismAngleDegrees =
      input.observedHaloRadiusDegrees - hexagonalPrismMinimumDeviationDegrees;
  return {
    hexagonalPrismMinimumDeviationDegrees,
    observedMinusPrismAngleDegrees,
    withinCallerAngularTolerance:
      Math.abs(observedMinusPrismAngleDegrees) <=
      input.callerAngularToleranceDegrees,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  relativeIceRefractiveIndex: 1.31,
  observedHaloRadiusDegrees: 22,
  callerAngularToleranceDegrees: 1,
} satisfies Input;
export const exampleOutput = {
  hexagonalPrismMinimumDeviationDegrees: 21.839299909773032,
  observedMinusPrismAngleDegrees: 0.16070009022696752,
  withinCallerAngularTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/halo-22-degree-ice-crystal-checker",
  title: "Halo 22 Degree Ice Crystal Checker",
  description:
    "Compare observed angular radius to ideal 60-degree hexagonal ice-prism minimum deviation under caller index/tolerance; angular agreement does not prove ice crystal habit, visible halo or sun-viewing safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "hexagonalPrismMinimumDeviationDegrees",
      label: "Hexagonal prism minimum deviation degrees",
      kind: "number",
    },
    {
      id: "observedMinusPrismAngleDegrees",
      label: "Observed minus prism angle degrees",
      kind: "number",
    },
    {
      id: "withinCallerAngularTolerance",
      label: "Within caller angular tolerance",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      relativeIceRefractiveIndex: value.relativeIceRefractiveIndex as number,
      observedHaloRadiusDegrees: value.observedHaloRadiusDegrees as number,
      callerAngularToleranceDegrees:
        value.callerAngularToleranceDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
