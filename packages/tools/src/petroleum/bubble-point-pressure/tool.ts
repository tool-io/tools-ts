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
  readonly observedBubbleGasTestPressuresPa: readonly number[];
  readonly observedBubbleGasPhaseFractions: readonly number[];
  readonly callerBubbleGasOnsetPhaseFraction: number;
}>;
export type Output = Readonly<{
  readonly observedPhaseOnsetPressureCrossingsPa: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBubbleGasTestPressuresPa",
    label: "Observed bubble gas test pressures pa",
    kind: "numberList",
  },
  {
    id: "observedBubbleGasPhaseFractions",
    label: "Observed bubble gas phase fractions",
    kind: "numberList",
  },
  {
    id: "callerBubbleGasOnsetPhaseFraction",
    label: "Caller bubble gas onset phase fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBubbleGasTestPressuresPa.forEach((v) =>
    positive(v, "observedBubbleGasTestPressuresPa"),
  );
  input.observedBubbleGasPhaseFractions.forEach((v) =>
    fraction(v, "observedBubbleGasPhaseFractions"),
  );
  fraction(
    input.callerBubbleGasOnsetPhaseFraction,
    "callerBubbleGasOnsetPhaseFraction",
  );
  return {
    observedPhaseOnsetPressureCrossingsPa: crossings(
      input.observedBubbleGasTestPressuresPa,
      input.observedBubbleGasPhaseFractions,
      input.callerBubbleGasOnsetPhaseFraction,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBubbleGasTestPressuresPa: [1, 2, 3],
  observedBubbleGasPhaseFractions: [0.4, 0.2, 0],
  callerBubbleGasOnsetPhaseFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  observedPhaseOnsetPressureCrossingsPa: [2.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/bubble-point-pressure",
  title: "Petroleum Bubble Point Pressure Calculator",
  description:
    "Extract actual independently identified BubbleGas onset at explicit measured phase-fraction criterion, preserve all/no crossings, no inferred composition-specific equilibrium EOS or pressure operating limit. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedBubbleGasTestPressuresPa:
        value.observedBubbleGasTestPressuresPa as readonly number[],
      observedBubbleGasPhaseFractions:
        value.observedBubbleGasPhaseFractions as readonly number[],
      callerBubbleGasOnsetPhaseFraction:
        value.callerBubbleGasOnsetPhaseFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
