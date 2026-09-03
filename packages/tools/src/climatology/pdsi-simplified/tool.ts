import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction, finite } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly independentlyCalibratedMonthlyPalmerZ: readonly number[];
  readonly callerPreviousPalmerState: number;
  readonly callerPersistenceFactor: number;
}>;
export type Output = Readonly<{
  readonly simplifiedMonthlyPalmerStates: readonly number[];
}>;
const inputFields = [
  {
    id: "independentlyCalibratedMonthlyPalmerZ",
    label: "Independently calibrated monthly palmer z",
    kind: "numberList",
  },
  {
    id: "callerPreviousPalmerState",
    label: "Caller previous palmer state",
    kind: "number",
  },
  {
    id: "callerPersistenceFactor",
    label: "Caller persistence factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.callerPersistenceFactor, "callerPersistenceFactor");
  let x = input.callerPreviousPalmerState;
  return {
    simplifiedMonthlyPalmerStates:
      input.independentlyCalibratedMonthlyPalmerZ.map((z) => {
        x = finite(input.callerPersistenceFactor * x + z / 3);
        return x;
      }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyCalibratedMonthlyPalmerZ: [3, -3],
  callerPreviousPalmerState: 0,
  callerPersistenceFactor: 0.897,
} satisfies Input;
export const exampleOutput = {
  simplifiedMonthlyPalmerStates: [1, -0.103],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/pdsi-simplified",
  title: "Palmer Drought Severity Index Simplified Calculator",
  description:
    "Explicit classic linear Palmer recurrence X=p Xprevious+Z/3 with independently calibrated Z; not complete PDSI spell-selection/soil calibration or absolute drought severity from precipitation. Caller independently establishes homogeneous observation coverage and model/reference applicability; not observed future climate, crop suitability or validated drought severity.",
  inputs: inputFields,
  outputs: [
    {
      id: "simplifiedMonthlyPalmerStates",
      label: "Simplified monthly palmer states",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyCalibratedMonthlyPalmerZ:
        value.independentlyCalibratedMonthlyPalmerZ as readonly number[],
      callerPreviousPalmerState: value.callerPreviousPalmerState as number,
      callerPersistenceFactor: value.callerPersistenceFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
