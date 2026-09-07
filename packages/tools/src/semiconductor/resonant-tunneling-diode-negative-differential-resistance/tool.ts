import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  strictlyIncreasing,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedRtdBiasV: readonly number[];
  readonly observedRtdDrainAmps: readonly number[];
}>;
export type Output = Readonly<{
  readonly localDifferentialResistanceOhm: readonly number[];
  readonly negativeDifferentialSegmentIndices: readonly number[];
}>;
const inputFields = [
  { id: "observedRtdBiasV", label: "Observed rtd bias v", kind: "numberList" },
  {
    id: "observedRtdDrainAmps",
    label: "Observed rtd drain amps",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRtdDrainAmps.forEach((v) =>
    nonnegative(v, "observedRtdDrainAmps"),
  );
  aligned(input.observedRtdBiasV, input.observedRtdDrainAmps, "curve");
  strictlyIncreasing(input.observedRtdBiasV, "bias");
  const resistance = input.observedRtdBiasV.slice(1).map((v, i) => {
    const delta =
      input.observedRtdDrainAmps[i + 1] - input.observedRtdDrainAmps[i];
    if (delta === 0)
      simpleError(
        "current",
        "Nonzero local current difference required for finite differential resistance.",
      );
    return (v - input.observedRtdBiasV[i]) / delta;
  });
  return {
    localDifferentialResistanceOhm: resistance,
    negativeDifferentialSegmentIndices: resistance.flatMap((v, i) =>
      v < 0 ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRtdBiasV: [0, 1, 2],
  observedRtdDrainAmps: [1, 3, 2],
} satisfies Input;
export const exampleOutput = {
  localDifferentialResistanceOhm: [0.5, -1],
  negativeDifferentialSegmentIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/resonant-tunneling-diode-negative-differential-resistance",
  title:
    "Semiconductor Resonant Tunneling Diode Negative Differential Resistance Calculator",
  description:
    "Extract actual finite-segment signed RTD differential resistance and negative branch witnesses, not peak-to-valley ratio or global equivalent circuit.",
  inputs: inputFields,
  outputs: [
    {
      id: "localDifferentialResistanceOhm",
      label: "Local differential resistance ohm",
      kind: "numberList",
    },
    {
      id: "negativeDifferentialSegmentIndices",
      label: "Negative differential segment indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRtdBiasV: value.observedRtdBiasV as readonly number[],
      observedRtdDrainAmps: value.observedRtdDrainAmps as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
