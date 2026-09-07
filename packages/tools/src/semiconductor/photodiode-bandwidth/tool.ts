import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedDetectorResistanceOhm: number;
  readonly observedDetectorTotalCapacitanceFarads: number;
  readonly callerMatchedTransitLimitedHz: number;
}>;
export type Output = Readonly<{
  readonly modeledRcLimitedHz: number;
  readonly combinedInverseSquareDetectorBandwidthHz: number;
}>;
const inputFields = [
  {
    id: "observedDetectorResistanceOhm",
    label: "Observed detector resistance ohm",
    kind: "number",
  },
  {
    id: "observedDetectorTotalCapacitanceFarads",
    label: "Observed detector total capacitance farads",
    kind: "number",
  },
  {
    id: "callerMatchedTransitLimitedHz",
    label: "Caller matched transit limited hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedDetectorResistanceOhm,
    "observedDetectorResistanceOhm",
  );
  positive(
    input.observedDetectorTotalCapacitanceFarads,
    "observedDetectorTotalCapacitanceFarads",
  );
  positive(
    input.callerMatchedTransitLimitedHz,
    "callerMatchedTransitLimitedHz",
  );
  const rc =
    1 /
    (2 *
      Math.PI *
      input.observedDetectorResistanceOhm *
      input.observedDetectorTotalCapacitanceFarads);
  return {
    modeledRcLimitedHz: rc,
    combinedInverseSquareDetectorBandwidthHz:
      1 / Math.hypot(1 / rc, 1 / input.callerMatchedTransitLimitedHz),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDetectorResistanceOhm: 100,
  observedDetectorTotalCapacitanceFarads: 1e-9,
  callerMatchedTransitLimitedHz: 1000000.0,
} satisfies Input;
export const exampleOutput = {
  modeledRcLimitedHz: 1591549.4309189534,
  combinedInverseSquareDetectorBandwidthHz: 846733.0159648305,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/photodiode-bandwidth",
  title: "Semiconductor Photodiode Bandwidth Calculator",
  description:
    "Combine actual detector RC and independently established transit bandwidth under explicit inverse-square approximation, not RC-only cutoff, amplifier design or equipment safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledRcLimitedHz",
      label: "Modeled rc limited hz",
      kind: "number",
    },
    {
      id: "combinedInverseSquareDetectorBandwidthHz",
      label: "Combined inverse square detector bandwidth hz",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDetectorResistanceOhm:
        value.observedDetectorResistanceOhm as number,
      observedDetectorTotalCapacitanceFarads:
        value.observedDetectorTotalCapacitanceFarads as number,
      callerMatchedTransitLimitedHz:
        value.callerMatchedTransitLimitedHz as number,
    }),
});
export const run = tool.execute;
export default tool;
