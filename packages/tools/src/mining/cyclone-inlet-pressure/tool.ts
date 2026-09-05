import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedCycloneGaugeInletPa: readonly number[];
  readonly observedGaugeOutletPa: readonly number[];
  readonly observedUpstreamGaugeOffsetPa: readonly number[];
  readonly observedDownstreamGaugeOffsetPa: readonly number[];
}>;
export type Output = Readonly<{
  readonly offsetCorrectedCyclonePressureDropPa: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCycloneGaugeInletPa",
    label: "Observed cyclone gauge inlet pa",
    kind: "numberList",
  },
  {
    id: "observedGaugeOutletPa",
    label: "Observed gauge outlet pa",
    kind: "numberList",
  },
  {
    id: "observedUpstreamGaugeOffsetPa",
    label: "Observed upstream gauge offset pa",
    kind: "numberList",
  },
  {
    id: "observedDownstreamGaugeOffsetPa",
    label: "Observed downstream gauge offset pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedCycloneGaugeInletPa,
    input.observedGaugeOutletPa,
    "observedCycloneGaugeInletPa",
  );
  aligned(
    input.observedCycloneGaugeInletPa,
    input.observedUpstreamGaugeOffsetPa,
    "observedCycloneGaugeInletPa",
  );
  aligned(
    input.observedCycloneGaugeInletPa,
    input.observedDownstreamGaugeOffsetPa,
    "observedCycloneGaugeInletPa",
  );
  return {
    offsetCorrectedCyclonePressureDropPa: input.observedCycloneGaugeInletPa.map(
      (v, i) =>
        v -
        input.observedUpstreamGaugeOffsetPa[i] -
        input.observedGaugeOutletPa[i] +
        input.observedDownstreamGaugeOffsetPa[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCycloneGaugeInletPa: [100, 200],
  observedGaugeOutletPa: [20, 50],
  observedUpstreamGaugeOffsetPa: [5, 10],
  observedDownstreamGaugeOffsetPa: [2, 3],
} satisfies Input;
export const exampleOutput = {
  offsetCorrectedCyclonePressureDropPa: [77, 143],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/cyclone-inlet-pressure",
  title: "Cyclone Inlet Pressure Calculator",
  description:
    "Audit actual cyclone inlet/outlet pressure gauges with independent calibration offsets, retain negative drop evidence; not forward dynamic-head pressure model. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "offsetCorrectedCyclonePressureDropPa",
      label: "Offset corrected cyclone pressure drop pa",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCycloneGaugeInletPa:
        value.observedCycloneGaugeInletPa as readonly number[],
      observedGaugeOutletPa: value.observedGaugeOutletPa as readonly number[],
      observedUpstreamGaugeOffsetPa:
        value.observedUpstreamGaugeOffsetPa as readonly number[],
      observedDownstreamGaugeOffsetPa:
        value.observedDownstreamGaugeOffsetPa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
