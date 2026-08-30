import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  mean,
  maximum,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly referenceEmitterFlowLitersPerHour: number;
  readonly referencePressureKpa: number;
  readonly emitterPressuresKpa: readonly number[];
  readonly calibratedPressureExponent: number;
}>;
export type Output = Readonly<{
  readonly modelEmitterFlowsLitersPerHour: readonly number[];
  readonly meanModelFlowLitersPerHour: number;
  readonly relativeModelFlowRange: number;
}>;
const inputFields = [
  {
    id: "referenceEmitterFlowLitersPerHour",
    label: "Reference emitter flow liters per hour",
    kind: "number",
  },
  {
    id: "referencePressureKpa",
    label: "Reference pressure kpa",
    kind: "number",
  },
  {
    id: "emitterPressuresKpa",
    label: "Emitter pressures kpa",
    kind: "numberList",
  },
  {
    id: "calibratedPressureExponent",
    label: "Calibrated pressure exponent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.referenceEmitterFlowLitersPerHour,
    "referenceEmitterFlowLitersPerHour",
  );
  positive(input.referencePressureKpa, "referencePressureKpa");
  input.emitterPressuresKpa.forEach((v) =>
    nonnegative(v, "emitterPressuresKpa"),
  );
  nonnegative(input.calibratedPressureExponent, "calibratedPressureExponent");
  if (
    input.emitterPressuresKpa.some((v) => v === 0) &&
    input.calibratedPressureExponent === 0
  )
    simpleError(
      "pressure",
      "Zero pressure with zero exponent is not a calibrated emitter state.",
    );
  const modelEmitterFlowsLitersPerHour = input.emitterPressuresKpa.map(
      (p) =>
        input.referenceEmitterFlowLitersPerHour *
        (p / input.referencePressureKpa) ** input.calibratedPressureExponent,
    ),
    m = positive(mean(modelEmitterFlowsLitersPerHour), "meanFlow");
  return {
    modelEmitterFlowsLitersPerHour,
    meanModelFlowLitersPerHour: m,
    relativeModelFlowRange:
      (maximum(modelEmitterFlowsLitersPerHour) -
        minimum(modelEmitterFlowsLitersPerHour)) /
      m,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceEmitterFlowLitersPerHour: 1,
  referencePressureKpa: 100,
  emitterPressuresKpa: [100, 400],
  calibratedPressureExponent: 0.5,
} satisfies Input;
export const exampleOutput = {
  modelEmitterFlowsLitersPerHour: [1, 2],
  meanModelFlowLitersPerHour: 1.5,
  relativeModelFlowRange: 0.6666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/drip-irrigation-emitter-flow",
  title: "Agriculture Drip Irrigation Emitter Flow",
  description:
    "Apply supplied emitter pressure-flow calibration across measured operating pressures and summarize flow variation; no universal emitter exponent or pressure-compensated model extrapolation.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelEmitterFlowsLitersPerHour",
      label: "Model emitter flows liters per hour",
      kind: "numberList",
    },
    {
      id: "meanModelFlowLitersPerHour",
      label: "Mean model flow liters per hour",
      kind: "number",
    },
    {
      id: "relativeModelFlowRange",
      label: "Relative model flow range",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceEmitterFlowLitersPerHour:
        value.referenceEmitterFlowLitersPerHour as number,
      referencePressureKpa: value.referencePressureKpa as number,
      emitterPressuresKpa: value.emitterPressuresKpa as readonly number[],
      calibratedPressureExponent: value.calibratedPressureExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
