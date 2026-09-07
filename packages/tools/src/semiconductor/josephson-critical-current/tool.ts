import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  crossings,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedJosephsonBiasAmps: readonly number[];
  readonly observedJunctionVoltages: readonly number[];
  readonly callerVoltageOnsetCriterion: number;
}>;
export type Output = Readonly<{
  readonly observedCriticalCurrentCrossingsAmps: readonly number[];
}>;
const inputFields = [
  {
    id: "observedJosephsonBiasAmps",
    label: "Observed josephson bias amps",
    kind: "numberList",
  },
  {
    id: "observedJunctionVoltages",
    label: "Observed junction voltages",
    kind: "numberList",
  },
  {
    id: "callerVoltageOnsetCriterion",
    label: "Caller voltage onset criterion",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedJosephsonBiasAmps.forEach((v) =>
    nonnegative(v, "observedJosephsonBiasAmps"),
  );
  input.observedJunctionVoltages.forEach((v) =>
    nonnegative(v, "observedJunctionVoltages"),
  );
  nonnegative(input.callerVoltageOnsetCriterion, "callerVoltageOnsetCriterion");
  return {
    observedCriticalCurrentCrossingsAmps: crossings(
      input.observedJosephsonBiasAmps,
      input.observedJunctionVoltages,
      input.callerVoltageOnsetCriterion,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedJosephsonBiasAmps: [0, 1, 2, 3],
  observedJunctionVoltages: [0, 0, 0.01, 0.03],
  callerVoltageOnsetCriterion: 0.005,
} satisfies Input;
export const exampleOutput = {
  observedCriticalCurrentCrossingsAmps: [1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/josephson-critical-current",
  title: "Semiconductor Josephson Critical Current Calculator",
  description:
    "Extract actual measured Josephson voltage-onset current under caller criterion, not assumed Ambegaokar–Baratoff gap/Rn model or superconductivity proof.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCriticalCurrentCrossingsAmps",
      label: "Observed critical current crossings amps",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedJosephsonBiasAmps:
        value.observedJosephsonBiasAmps as readonly number[],
      observedJunctionVoltages:
        value.observedJunctionVoltages as readonly number[],
      callerVoltageOnsetCriterion: value.callerVoltageOnsetCriterion as number,
    }),
});
export const run = tool.execute;
export default tool;
