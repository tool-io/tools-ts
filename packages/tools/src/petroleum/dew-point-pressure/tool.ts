import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  crossings,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedDewLiquidTestPressuresPa: readonly number[];
  readonly observedDewLiquidPhaseFractions: readonly number[];
  readonly callerDewLiquidOnsetPhaseFraction: number;
}>;
export type Output = Readonly<{
  readonly observedPhaseOnsetPressureCrossingsPa: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDewLiquidTestPressuresPa",
    label: "Observed dew liquid test pressures pa",
    kind: "numberList",
  },
  {
    id: "observedDewLiquidPhaseFractions",
    label: "Observed dew liquid phase fractions",
    kind: "numberList",
  },
  {
    id: "callerDewLiquidOnsetPhaseFraction",
    label: "Caller dew liquid onset phase fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDewLiquidTestPressuresPa.forEach((v) =>
    positive(v, "observedDewLiquidTestPressuresPa"),
  );
  input.observedDewLiquidPhaseFractions.forEach((v) =>
    fraction(v, "observedDewLiquidPhaseFractions"),
  );
  fraction(
    input.callerDewLiquidOnsetPhaseFraction,
    "callerDewLiquidOnsetPhaseFraction",
  );
  return {
    observedPhaseOnsetPressureCrossingsPa: crossings(
      input.observedDewLiquidTestPressuresPa,
      input.observedDewLiquidPhaseFractions,
      input.callerDewLiquidOnsetPhaseFraction,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDewLiquidTestPressuresPa: [1, 2, 3],
  observedDewLiquidPhaseFractions: [0.4, 0.2, 0],
  callerDewLiquidOnsetPhaseFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  observedPhaseOnsetPressureCrossingsPa: [2.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/dew-point-pressure",
  title: "Petroleum Dew Point Pressure Calculator",
  description:
    "Extract actual independently identified DewLiquid onset at explicit measured phase-fraction criterion, preserve all/no crossings, no inferred composition-specific equilibrium EOS or pressure operating limit. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPhaseOnsetPressureCrossingsPa",
      label: "Observed phase onset pressure crossings pa",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDewLiquidTestPressuresPa:
        value.observedDewLiquidTestPressuresPa as readonly number[],
      observedDewLiquidPhaseFractions:
        value.observedDewLiquidPhaseFractions as readonly number[],
      callerDewLiquidOnsetPhaseFraction:
        value.callerDewLiquidOnsetPhaseFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
