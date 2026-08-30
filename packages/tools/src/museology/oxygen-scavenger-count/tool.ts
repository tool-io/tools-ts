import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  safeCeil,
} from "../shared.js";
export type Input = Readonly<{
  readonly headspaceLiters: number;
  readonly initialOxygenFraction: number;
  readonly maximumResidualOxygenFraction: number;
  readonly entrainedOxygenLiters: number;
  readonly forecastOxygenIngressLiters: number;
  readonly usableSachetOxygenCapacityLiters: number;
}>;
export type Output = Readonly<{
  readonly modelOxygenRemovalDemandLiters: number;
  readonly wholeScavengerSachetsRequired: number;
  readonly unusedOxygenRemovalCapacityLiters: number;
}>;
const inputFields = [
  { id: "headspaceLiters", label: "Headspace liters", kind: "number" },
  {
    id: "initialOxygenFraction",
    label: "Initial oxygen fraction",
    kind: "number",
  },
  {
    id: "maximumResidualOxygenFraction",
    label: "Maximum residual oxygen fraction",
    kind: "number",
  },
  {
    id: "entrainedOxygenLiters",
    label: "Entrained oxygen liters",
    kind: "number",
  },
  {
    id: "forecastOxygenIngressLiters",
    label: "Forecast oxygen ingress liters",
    kind: "number",
  },
  {
    id: "usableSachetOxygenCapacityLiters",
    label: "Usable sachet oxygen capacity liters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.usableSachetOxygenCapacityLiters,
    "usableSachetOxygenCapacityLiters",
  );
  nonnegative(input.headspaceLiters, "headspaceLiters");
  nonnegative(input.entrainedOxygenLiters, "entrainedOxygenLiters");
  nonnegative(input.forecastOxygenIngressLiters, "forecastOxygenIngressLiters");
  fraction(input.initialOxygenFraction, "initialOxygenFraction");
  fraction(
    input.maximumResidualOxygenFraction,
    "maximumResidualOxygenFraction",
  );
  const demand =
      Math.max(
        0,
        input.headspaceLiters *
          (input.initialOxygenFraction - input.maximumResidualOxygenFraction),
      ) +
      input.entrainedOxygenLiters +
      input.forecastOxygenIngressLiters,
    n = safeCeil(demand / input.usableSachetOxygenCapacityLiters, "sachets");
  return {
    modelOxygenRemovalDemandLiters: demand,
    wholeScavengerSachetsRequired: n,
    unusedOxygenRemovalCapacityLiters:
      n * input.usableSachetOxygenCapacityLiters - demand,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  headspaceLiters: 10,
  initialOxygenFraction: 0.2,
  maximumResidualOxygenFraction: 0.01,
  entrainedOxygenLiters: 0.1,
  forecastOxygenIngressLiters: 0.5,
  usableSachetOxygenCapacityLiters: 0.5,
} satisfies Input;
export const exampleOutput = {
  modelOxygenRemovalDemandLiters: 2.5,
  wholeScavengerSachetsRequired: 5,
  unusedOxygenRemovalCapacityLiters: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/oxygen-scavenger-count",
  title: "Oxygen Scavenger Sachet Count per Enclosure Calculator",
  description:
    "Budget whole scavengers from declared gas-volume-equivalent oxygen, residual policy, entrainment/ingress and measured usable capacity; no kinetic/anoxic pest efficacy or enclosure/material safety assertion.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelOxygenRemovalDemandLiters",
      label: "Model oxygen removal demand liters",
      kind: "number",
    },
    {
      id: "wholeScavengerSachetsRequired",
      label: "Whole scavenger sachets required",
      kind: "number",
    },
    {
      id: "unusedOxygenRemovalCapacityLiters",
      label: "Unused oxygen removal capacity liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      headspaceLiters: value.headspaceLiters as number,
      initialOxygenFraction: value.initialOxygenFraction as number,
      maximumResidualOxygenFraction:
        value.maximumResidualOxygenFraction as number,
      entrainedOxygenLiters: value.entrainedOxygenLiters as number,
      forecastOxygenIngressLiters: value.forecastOxygenIngressLiters as number,
      usableSachetOxygenCapacityLiters:
        value.usableSachetOxygenCapacityLiters as number,
    }),
});
export const run = tool.execute;
export default tool;
