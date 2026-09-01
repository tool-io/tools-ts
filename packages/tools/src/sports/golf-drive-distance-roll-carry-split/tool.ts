import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedCarryDistancesMeters: readonly number[];
  readonly observedTotalDriveDistancesMeters: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedObservedRollDistancesMeters: readonly number[];
  readonly observedCarrySharesOfTotal: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCarryDistancesMeters",
    label: "Observed carry distances meters",
    kind: "numberList",
  },
  {
    id: "observedTotalDriveDistancesMeters",
    label: "Observed total drive distances meters",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTotalDriveDistancesMeters.forEach((v) =>
    positive(v, "observedTotalDriveDistancesMeters"),
  );
  input.observedCarryDistancesMeters.forEach((v) =>
    nonnegative(v, "observedCarryDistancesMeters"),
  );
  aligned(
    input.observedCarryDistancesMeters,
    input.observedTotalDriveDistancesMeters,
    "observedCarryDistancesMeters",
  );
  return {
    signedObservedRollDistancesMeters:
      input.observedTotalDriveDistancesMeters.map(
        (v, i) => v - input.observedCarryDistancesMeters[i],
      ),
    observedCarrySharesOfTotal: input.observedCarryDistancesMeters.map(
      (v, i) => v / input.observedTotalDriveDistancesMeters[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCarryDistancesMeters: [200, 220],
  observedTotalDriveDistancesMeters: [210, 215],
} satisfies Input;
export const exampleOutput = {
  signedObservedRollDistancesMeters: [10, -5],
  observedCarrySharesOfTotal: [0.9523809523809523, 1.0232558139534884],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/golf-drive-distance-roll-carry-split",
  title: "Drive Carry/Roll Distance Split",
  description:
    "Separate actual carry/total drive observations, retaining negative roll or mismatched observations instead of clipping; no ballistic carry inference or course advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedObservedRollDistancesMeters",
      label: "Signed observed roll distances meters",
      kind: "numberList",
    },
    {
      id: "observedCarrySharesOfTotal",
      label: "Observed carry shares of total",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCarryDistancesMeters:
        value.observedCarryDistancesMeters as readonly number[],
      observedTotalDriveDistancesMeters:
        value.observedTotalDriveDistancesMeters as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
