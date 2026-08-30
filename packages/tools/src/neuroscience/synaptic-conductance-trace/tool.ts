import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";
export type Input = Readonly<{
  readonly currentsPa: readonly number[];
  readonly holdingPotentialMv: number;
  readonly reversalPotentialMv: number;
}>;
export type Output = Readonly<{
  readonly drivingForceMv: number;
  readonly conductancesNs: readonly number[];
}>;
const inputFields = [
  { id: "currentsPa", label: "Currents pa", kind: "numberList" },
  { id: "holdingPotentialMv", label: "Holding potential mv", kind: "number" },
  { id: "reversalPotentialMv", label: "Reversal potential mv", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.currentsPa.length)
    simpleError("currentsPa", "Nonempty synaptic-current trace required.");
  const drivingForceMv = input.holdingPotentialMv - input.reversalPotentialMv;
  if (drivingForceMv === 0)
    simpleError("holdingPotentialMv", "Nonzero driving force required.");
  const conductancesNs = input.currentsPa.map((v) => v / drivingForceMv);
  if (conductancesNs.some((v) => v < 0))
    simpleError(
      "currentsPa",
      "Current signs must be consistent with nonnegative conductance and the supplied reversal potential.",
    );
  return { drivingForceMv, conductancesNs };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  currentsPa: [-20, -40],
  holdingPotentialMv: -60,
  reversalPotentialMv: -40,
} satisfies Input;
export const exampleOutput = {
  drivingForceMv: -20,
  conductancesNs: [1, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/synaptic-conductance-trace",
  title: "Synaptic Conductance",
  description:
    "Convert a leak-subtracted voltage-clamp current trace into conductance at a fixed nonzero driving force; pA/mV yields nS.",
  inputs: inputFields,
  outputs: [
    { id: "drivingForceMv", label: "Driving force mv", kind: "number" },
    { id: "conductancesNs", label: "Conductances ns", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      currentsPa: value.currentsPa as readonly number[],
      holdingPotentialMv: value.holdingPotentialMv as number,
      reversalPotentialMv: value.reversalPotentialMv as number,
    }),
});
export const run = tool.execute;
export default tool;
