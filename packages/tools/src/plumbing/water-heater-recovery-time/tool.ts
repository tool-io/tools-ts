import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedRequiredTankReheatJ: number;
  readonly measuredHeaterInputWatts: number;
  readonly callerDeliveredEfficiencyFraction: number;
  readonly observedConcurrentDrawLossWatts: number;
}>;
export type Output = Readonly<{
  readonly netAvailableRecoveryWatts: number;
  readonly modeledTankRecoveryMinutes: number;
}>;
const inputFields = [
  {
    id: "observedRequiredTankReheatJ",
    label: "Observed required tank reheat j",
    kind: "number",
  },
  {
    id: "measuredHeaterInputWatts",
    label: "Measured heater input watts",
    kind: "number",
  },
  {
    id: "callerDeliveredEfficiencyFraction",
    label: "Caller delivered efficiency fraction",
    kind: "number",
  },
  {
    id: "observedConcurrentDrawLossWatts",
    label: "Observed concurrent draw loss watts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.measuredHeaterInputWatts, "measuredHeaterInputWatts");
  positive(
    input.callerDeliveredEfficiencyFraction,
    "callerDeliveredEfficiencyFraction",
  );
  nonnegative(input.observedRequiredTankReheatJ, "observedRequiredTankReheatJ");
  nonnegative(
    input.observedConcurrentDrawLossWatts,
    "observedConcurrentDrawLossWatts",
  );
  fraction(
    input.callerDeliveredEfficiencyFraction,
    "callerDeliveredEfficiencyFraction",
  );
  const net =
    input.measuredHeaterInputWatts * input.callerDeliveredEfficiencyFraction -
    input.observedConcurrentDrawLossWatts;
  positive(net, "netRecovery");
  return {
    netAvailableRecoveryWatts: net,
    modeledTankRecoveryMinutes: input.observedRequiredTankReheatJ / net / 60,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRequiredTankReheatJ: 3600000,
  measuredHeaterInputWatts: 2000,
  callerDeliveredEfficiencyFraction: 0.75,
  observedConcurrentDrawLossWatts: 500,
} satisfies Input;
export const exampleOutput = {
  netAvailableRecoveryWatts: 1000,
  modeledTankRecoveryMinutes: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/water-heater-recovery-time",
  title: "Plumbing Water Heater Recovery Time Calculator",
  description:
    "Solve actual tank recovery energy under independently measured input/efficiency and concurrent draw loss, rejecting no-positive-recovery states; not single energy/power conversion or delivery guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "netAvailableRecoveryWatts",
      label: "Net available recovery watts",
      kind: "number",
    },
    {
      id: "modeledTankRecoveryMinutes",
      label: "Modeled tank recovery minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRequiredTankReheatJ: value.observedRequiredTankReheatJ as number,
      measuredHeaterInputWatts: value.measuredHeaterInputWatts as number,
      callerDeliveredEfficiencyFraction:
        value.callerDeliveredEfficiencyFraction as number,
      observedConcurrentDrawLossWatts:
        value.observedConcurrentDrawLossWatts as number,
    }),
});
export const run = tool.execute;
export default tool;
