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
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedMillEnergyKwh: readonly number[];
  readonly observedNonComminutionEnergyKwh: readonly number[];
  readonly observedProcessedDryTonnes: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedGrossSpecificKwhT: number;
  readonly observedNetSpecificKwhT: number;
}>;
const inputFields = [
  {
    id: "observedMillEnergyKwh",
    label: "Observed mill energy kwh",
    kind: "numberList",
  },
  {
    id: "observedNonComminutionEnergyKwh",
    label: "Observed non comminution energy kwh",
    kind: "numberList",
  },
  {
    id: "observedProcessedDryTonnes",
    label: "Observed processed dry tonnes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedProcessedDryTonnes.forEach((v) =>
    positive(v, "observedProcessedDryTonnes"),
  );
  input.observedMillEnergyKwh.forEach((v) =>
    nonnegative(v, "observedMillEnergyKwh"),
  );
  input.observedNonComminutionEnergyKwh.forEach((v) =>
    nonnegative(v, "observedNonComminutionEnergyKwh"),
  );
  aligned(
    input.observedMillEnergyKwh,
    input.observedNonComminutionEnergyKwh,
    "observedMillEnergyKwh",
  );
  aligned(
    input.observedMillEnergyKwh,
    input.observedProcessedDryTonnes,
    "observedMillEnergyKwh",
  );
  input.observedNonComminutionEnergyKwh.forEach((v, i) => {
    if (v > input.observedMillEnergyKwh[i])
      simpleError("energy", "Matched noncomminution≤gross energy.");
  });
  return {
    observedGrossSpecificKwhT:
      sum(input.observedMillEnergyKwh) / sum(input.observedProcessedDryTonnes),
    observedNetSpecificKwhT:
      (sum(input.observedMillEnergyKwh) -
        sum(input.observedNonComminutionEnergyKwh)) /
      sum(input.observedProcessedDryTonnes),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMillEnergyKwh: [100, 200],
  observedNonComminutionEnergyKwh: [20, 50],
  observedProcessedDryTonnes: [10, 20],
} satisfies Input;
export const exampleOutput = {
  observedGrossSpecificKwhT: 10,
  observedNetSpecificKwhT: 7.666666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/comminution-specific-energy",
  title: "Comminution Specific Energy Calculator",
  description:
    "Audit actual energy meter/dry-throughput ledger with independent auxiliary exclusions, not forward Bond required energy or nominal power×production. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedGrossSpecificKwhT",
      label: "Observed gross specific kwh t",
      kind: "number",
    },
    {
      id: "observedNetSpecificKwhT",
      label: "Observed net specific kwh t",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMillEnergyKwh: value.observedMillEnergyKwh as readonly number[],
      observedNonComminutionEnergyKwh:
        value.observedNonComminutionEnergyKwh as readonly number[],
      observedProcessedDryTonnes:
        value.observedProcessedDryTonnes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
