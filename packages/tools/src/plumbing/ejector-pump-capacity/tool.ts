import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedEjectorPumpLitersMinute: number;
  readonly observedConcurrentSewageInflowLitersMinute: number;
  readonly observedUsableWetwellCycleLiters: number;
  readonly callerMaximumStartsPerHour: number;
}>;
export type Output = Readonly<{
  readonly modeledEjectorOnMinutes: number;
  readonly modeledEjectorOffMinutes: number;
  readonly modeledStartsPerHour: number;
  readonly withinCallerStartsPolicy: boolean;
}>;
const inputFields = [
  {
    id: "observedEjectorPumpLitersMinute",
    label: "Observed ejector pump liters minute",
    kind: "number",
  },
  {
    id: "observedConcurrentSewageInflowLitersMinute",
    label: "Observed concurrent sewage inflow liters minute",
    kind: "number",
  },
  {
    id: "observedUsableWetwellCycleLiters",
    label: "Observed usable wetwell cycle liters",
    kind: "number",
  },
  {
    id: "callerMaximumStartsPerHour",
    label: "Caller maximum starts per hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedEjectorPumpLitersMinute,
    "observedEjectorPumpLitersMinute",
  );
  positive(
    input.observedConcurrentSewageInflowLitersMinute,
    "observedConcurrentSewageInflowLitersMinute",
  );
  positive(
    input.observedUsableWetwellCycleLiters,
    "observedUsableWetwellCycleLiters",
  );
  positive(input.callerMaximumStartsPerHour, "callerMaximumStartsPerHour");
  const net =
    input.observedEjectorPumpLitersMinute -
    input.observedConcurrentSewageInflowLitersMinute;
  positive(net, "netDischarge");
  const on = input.observedUsableWetwellCycleLiters / net,
    off =
      input.observedUsableWetwellCycleLiters /
      input.observedConcurrentSewageInflowLitersMinute,
    starts = 60 / (on + off);
  return {
    modeledEjectorOnMinutes: on,
    modeledEjectorOffMinutes: off,
    modeledStartsPerHour: starts,
    withinCallerStartsPolicy: starts <= input.callerMaximumStartsPerHour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEjectorPumpLitersMinute: 30,
  observedConcurrentSewageInflowLitersMinute: 10,
  observedUsableWetwellCycleLiters: 40,
  callerMaximumStartsPerHour: 12,
} satisfies Input;
export const exampleOutput = {
  modeledEjectorOnMinutes: 2,
  modeledEjectorOffMinutes: 4,
  modeledStartsPerHour: 10,
  withinCallerStartsPolicy: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/ejector-pump-capacity",
  title: "Plumbing Ejector Pump Capacity Calculator",
  description:
    "Audit actual sewage ejector measured pump/inflow/cycle inventory and caller maximum starts, distinct from inverse sump duty sizing; no solids handling, ventilation or wastewater safety assurance.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledEjectorOnMinutes",
      label: "Modeled ejector on minutes",
      kind: "number",
    },
    {
      id: "modeledEjectorOffMinutes",
      label: "Modeled ejector off minutes",
      kind: "number",
    },
    {
      id: "modeledStartsPerHour",
      label: "Modeled starts per hour",
      kind: "number",
    },
    {
      id: "withinCallerStartsPolicy",
      label: "Within caller starts policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEjectorPumpLitersMinute:
        value.observedEjectorPumpLitersMinute as number,
      observedConcurrentSewageInflowLitersMinute:
        value.observedConcurrentSewageInflowLitersMinute as number,
      observedUsableWetwellCycleLiters:
        value.observedUsableWetwellCycleLiters as number,
      callerMaximumStartsPerHour: value.callerMaximumStartsPerHour as number,
    }),
});
export const run = tool.execute;
export default tool;
