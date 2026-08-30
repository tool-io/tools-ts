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
  fraction,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly stimulationFrequenciesHz: readonly number[];
  readonly peakForces: readonly number[];
  readonly troughForces: readonly number[];
  readonly maximumRippleFraction: number;
}>;
export type Output = Readonly<{
  readonly rippleFractions: readonly number[];
  readonly firstQualifyingFrequencyHz: number;
  readonly observedFusion: boolean;
}>;
const inputFields = [
  {
    id: "stimulationFrequenciesHz",
    label: "Stimulation frequencies hz",
    kind: "numberList",
  },
  { id: "peakForces", label: "Peak forces", kind: "numberList" },
  { id: "troughForces", label: "Trough forces", kind: "numberList" },
  {
    id: "maximumRippleFraction",
    label: "Maximum ripple fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.stimulationFrequenciesHz,
    input.peakForces,
    "stimulationFrequenciesHz",
  );
  aligned(
    input.stimulationFrequenciesHz,
    input.troughForces,
    "stimulationFrequenciesHz",
  );
  ordered(input.stimulationFrequenciesHz, "stimulationFrequenciesHz");
  input.stimulationFrequenciesHz.forEach((v) =>
    positive(v, "stimulationFrequenciesHz"),
  );
  fraction(input.maximumRippleFraction, "maximumRippleFraction");
  const rippleFractions = input.peakForces.map((v, i) => {
    positive(v, "peakForces");
    nonnegative(input.troughForces[i], "troughForces");
    if (input.troughForces[i] > v)
      simpleError("troughForces", "Trough cannot exceed peak force.");
    return (v - input.troughForces[i]) / v;
  });
  const index = rippleFractions.findIndex(
    (v) => v <= input.maximumRippleFraction,
  );
  return {
    rippleFractions,
    firstQualifyingFrequencyHz:
      index < 0 ? 0 : input.stimulationFrequenciesHz[index],
    observedFusion: index >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stimulationFrequenciesHz: [10, 20, 40],
  peakForces: [10, 10, 10],
  troughForces: [2, 6, 9],
  maximumRippleFraction: 0.15,
} satisfies Input;
export const exampleOutput = {
  rippleFractions: [0.8, 0.4, 0.1],
  firstQualifyingFrequencyHz: 40,
  observedFusion: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/tetanus-fusion-frequency-screen",
  title: "Tetanus Fusion Frequency",
  description:
    "Screen measured force ripple across stimulation frequencies against a supplied fusion criterion; zero qualifying frequency explicitly means no observed qualifying point.",
  inputs: inputFields,
  outputs: [
    { id: "rippleFractions", label: "Ripple fractions", kind: "numberList" },
    {
      id: "firstQualifyingFrequencyHz",
      label: "First qualifying frequency hz",
      kind: "number",
    },
    { id: "observedFusion", label: "Observed fusion", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      stimulationFrequenciesHz:
        value.stimulationFrequenciesHz as readonly number[],
      peakForces: value.peakForces as readonly number[],
      troughForces: value.troughForces as readonly number[],
      maximumRippleFraction: value.maximumRippleFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
