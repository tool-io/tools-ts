import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedPoolVolumeM3: number;
  readonly observedCirculationIntervalHours: readonly number[];
  readonly observedCirculationFlowsM3Hour: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedNominalCirculatedPoolVolumes: number;
  readonly observedMeanCirculationM3Hour: number;
  readonly nominalVolumeTurnoverHours: number;
}>;
const inputFields = [
  {
    id: "observedPoolVolumeM3",
    label: "Observed pool volume m3",
    kind: "number",
  },
  {
    id: "observedCirculationIntervalHours",
    label: "Observed circulation interval hours",
    kind: "numberList",
  },
  {
    id: "observedCirculationFlowsM3Hour",
    label: "Observed circulation flows m3 hour",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedPoolVolumeM3, "observedPoolVolumeM3");
  input.observedCirculationIntervalHours.forEach((v) =>
    positive(v, "observedCirculationIntervalHours"),
  );
  input.observedCirculationFlowsM3Hour.forEach((v) =>
    nonnegative(v, "observedCirculationFlowsM3Hour"),
  );
  aligned(
    input.observedCirculationIntervalHours,
    input.observedCirculationFlowsM3Hour,
    "observedCirculationIntervalHours",
  );
  const volume = sum(
      input.observedCirculationIntervalHours.map(
        (v, i) => v * input.observedCirculationFlowsM3Hour[i],
      ),
    ),
    hours = sum(input.observedCirculationIntervalHours),
    flow = volume / hours;
  positive(flow, "circulation");
  return {
    observedNominalCirculatedPoolVolumes: volume / input.observedPoolVolumeM3,
    observedMeanCirculationM3Hour: flow,
    nominalVolumeTurnoverHours: input.observedPoolVolumeM3 / flow,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPoolVolumeM3: 100,
  observedCirculationIntervalHours: [1, 2],
  observedCirculationFlowsM3Hour: [10, 20],
} satisfies Input;
export const exampleOutput = {
  observedNominalCirculatedPoolVolumes: 0.5,
  observedMeanCirculationM3Hour: 16.666666666666668,
  nominalVolumeTurnoverHours: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pool-turnover-rate",
  title: "Plumbing Pool Turnover Rate Calculator",
  description:
    "Integrate actual time-varying pool circulation ledger to nominal volume turnover; not fraction of water disinfected, perfect mixing, pathogen reduction or pool readiness.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedNominalCirculatedPoolVolumes",
      label: "Observed nominal circulated pool volumes",
      kind: "number",
    },
    {
      id: "observedMeanCirculationM3Hour",
      label: "Observed mean circulation m3 hour",
      kind: "number",
    },
    {
      id: "nominalVolumeTurnoverHours",
      label: "Nominal volume turnover hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPoolVolumeM3: value.observedPoolVolumeM3 as number,
      observedCirculationIntervalHours:
        value.observedCirculationIntervalHours as readonly number[],
      observedCirculationFlowsM3Hour:
        value.observedCirculationFlowsM3Hour as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
