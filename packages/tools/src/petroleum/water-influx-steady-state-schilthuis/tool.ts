import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integral,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAquiferTimesDays: readonly number[];
  readonly observedBoundaryPressurePa: readonly number[];
  readonly callerUndepletedAquiferPressurePa: number;
  readonly callerIndependentlyEstablishedAquiferPiM3DayPa: number;
}>;
export type Output = Readonly<{
  readonly schilthuisSignedInfluxReservoirM3: number;
}>;
const inputFields = [
  {
    id: "observedAquiferTimesDays",
    label: "Observed aquifer times days",
    kind: "numberList",
  },
  {
    id: "observedBoundaryPressurePa",
    label: "Observed boundary pressure pa",
    kind: "numberList",
  },
  {
    id: "callerUndepletedAquiferPressurePa",
    label: "Caller undepleted aquifer pressure pa",
    kind: "number",
  },
  {
    id: "callerIndependentlyEstablishedAquiferPiM3DayPa",
    label: "Caller independently established aquifer pi m3 day pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBoundaryPressurePa.forEach((v) =>
    positive(v, "observedBoundaryPressurePa"),
  );
  positive(
    input.callerUndepletedAquiferPressurePa,
    "callerUndepletedAquiferPressurePa",
  );
  positive(
    input.callerIndependentlyEstablishedAquiferPiM3DayPa,
    "callerIndependentlyEstablishedAquiferPiM3DayPa",
  );
  input.observedAquiferTimesDays.forEach((v) =>
    nonnegative(v, "observedAquiferTimesDays"),
  );
  const drop = input.observedBoundaryPressurePa.map(
    (v) => input.callerUndepletedAquiferPressurePa - v,
  );
  return {
    schilthuisSignedInfluxReservoirM3:
      input.callerIndependentlyEstablishedAquiferPiM3DayPa *
      integral(input.observedAquiferTimesDays, drop),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAquiferTimesDays: [0, 1, 3],
  observedBoundaryPressurePa: [10, 8, 8],
  callerUndepletedAquiferPressurePa: 10,
  callerIndependentlyEstablishedAquiferPiM3DayPa: 2,
} satisfies Input;
export const exampleOutput = {
  schilthuisSignedInfluxReservoirM3: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/water-influx-steady-state-schilthuis",
  title: "Petroleum Water Influx Steady State Schilthuis Calculator",
  description:
    "Named Schilthuis steady aquifer influx J∫(pi−p) dt over actual unequal-time boundary history, signed reversals retained; no generic lake inflow model or inferred aquiferPI. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "schilthuisSignedInfluxReservoirM3",
      label: "Schilthuis signed influx reservoir m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAquiferTimesDays:
        value.observedAquiferTimesDays as readonly number[],
      observedBoundaryPressurePa:
        value.observedBoundaryPressurePa as readonly number[],
      callerUndepletedAquiferPressurePa:
        value.callerUndepletedAquiferPressurePa as number,
      callerIndependentlyEstablishedAquiferPiM3DayPa:
        value.callerIndependentlyEstablishedAquiferPiM3DayPa as number,
    }),
});
export const run = tool.execute;
export default tool;
