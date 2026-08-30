import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly initialConcentrationMgPerLiter: number;
  readonly inputMassRateMgPerDay: number;
  readonly reservoirVolumeLiters: number;
  readonly outflowLitersPerDay: number;
  readonly degradationPerDay: number;
  readonly timesDays: readonly number[];
}>;
export type Output = Readonly<{
  readonly predictedConcentrationsMgPerLiter: readonly number[];
  readonly steadyStateConcentrationMgPerLiter: number;
}>;
const inputFields = [
  {
    id: "initialConcentrationMgPerLiter",
    label: "Initial concentration mg per liter",
    kind: "number",
  },
  {
    id: "inputMassRateMgPerDay",
    label: "Input mass rate mg per day",
    kind: "number",
  },
  {
    id: "reservoirVolumeLiters",
    label: "Reservoir volume liters",
    kind: "number",
  },
  {
    id: "outflowLitersPerDay",
    label: "Outflow liters per day",
    kind: "number",
  },
  { id: "degradationPerDay", label: "Degradation per day", kind: "number" },
  { id: "timesDays", label: "Times days", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.initialConcentrationMgPerLiter,
    "initialConcentrationMgPerLiter",
  );
  nonnegative(input.inputMassRateMgPerDay, "inputMassRateMgPerDay");
  positive(input.reservoirVolumeLiters, "reservoirVolumeLiters");
  nonnegative(input.outflowLitersPerDay, "outflowLitersPerDay");
  nonnegative(input.degradationPerDay, "degradationPerDay");
  if (!input.timesDays.length)
    simpleError("timesDays", "Nonempty observation times required.");
  input.timesDays.forEach((v) => nonnegative(v, "timesDays"));
  const rate = positive(
      input.outflowLitersPerDay / input.reservoirVolumeLiters +
        input.degradationPerDay,
      "degradationPerDay",
    ),
    steadyStateConcentrationMgPerLiter =
      input.inputMassRateMgPerDay / (rate * input.reservoirVolumeLiters);
  return {
    predictedConcentrationsMgPerLiter: input.timesDays.map(
      (t) =>
        steadyStateConcentrationMgPerLiter +
        (input.initialConcentrationMgPerLiter -
          steadyStateConcentrationMgPerLiter) *
          Math.exp(-rate * t),
    ),
    steadyStateConcentrationMgPerLiter,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialConcentrationMgPerLiter: 0,
  inputMassRateMgPerDay: 10,
  reservoirVolumeLiters: 100,
  outflowLitersPerDay: 10,
  degradationPerDay: 0.1,
  timesDays: [0, 1, 2],
} satisfies Input;
export const exampleOutput = {
  predictedConcentrationsMgPerLiter: [
    0, 0.09063462346100909, 0.16483997698218034,
  ],
  steadyStateConcentrationMgPerLiter: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/mixed-reservoir-predicted-concentration",
  title: "PEC",
  description:
    "Predict concentration in an ideal constant-volume mixed receiving reservoir with fixed input, outflow and first-order degradation; not a site-specific fate assessment.",
  inputs: inputFields,
  outputs: [
    {
      id: "predictedConcentrationsMgPerLiter",
      label: "Predicted concentrations mg per liter",
      kind: "numberList",
    },
    {
      id: "steadyStateConcentrationMgPerLiter",
      label: "Steady state concentration mg per liter",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialConcentrationMgPerLiter:
        value.initialConcentrationMgPerLiter as number,
      inputMassRateMgPerDay: value.inputMassRateMgPerDay as number,
      reservoirVolumeLiters: value.reservoirVolumeLiters as number,
      outflowLitersPerDay: value.outflowLitersPerDay as number,
      degradationPerDay: value.degradationPerDay as number,
      timesDays: value.timesDays as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
