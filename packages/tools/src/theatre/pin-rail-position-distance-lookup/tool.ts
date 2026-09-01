import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  points,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly pinRailLocalCoordinatesM: readonly (readonly number[])[];
  readonly correspondingLineDropCoordinatesM: readonly (readonly number[])[];
  readonly callerMaximumLateralOffsetM: number;
}>;
export type Output = Readonly<{
  readonly observedRailToDropDistancesM: readonly number[];
  readonly offsetsAboveCallerPlanBudget: readonly number[];
}>;
const inputFields = [
  {
    id: "pinRailLocalCoordinatesM",
    label: "Pin rail local coordinates m",
    kind: "matrix",
  },
  {
    id: "correspondingLineDropCoordinatesM",
    label: "Corresponding line drop coordinates m",
    kind: "matrix",
  },
  {
    id: "callerMaximumLateralOffsetM",
    label: "Caller maximum lateral offset m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerMaximumLateralOffsetM, "callerMaximumLateralOffsetM");
  aligned(
    input.pinRailLocalCoordinatesM,
    input.correspondingLineDropCoordinatesM,
    "pinRailLocalCoordinatesM",
  );
  points(input.pinRailLocalCoordinatesM);
  points(input.correspondingLineDropCoordinatesM);
  const distances = input.pinRailLocalCoordinatesM.map((p, i) =>
    Math.hypot(
      p[0] - input.correspondingLineDropCoordinatesM[i][0],
      p[1] - input.correspondingLineDropCoordinatesM[i][1],
    ),
  );
  return {
    observedRailToDropDistancesM: distances,
    offsetsAboveCallerPlanBudget: distances.flatMap((v, i) =>
      v > input.callerMaximumLateralOffsetM ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pinRailLocalCoordinatesM: [
    [0, 0],
    [0, 4],
  ],
  correspondingLineDropCoordinatesM: [
    [3, 0],
    [3, 4],
  ],
  callerMaximumLateralOffsetM: 2,
} satisfies Input;
export const exampleOutput = {
  observedRailToDropDistancesM: [3, 3],
  offsetsAboveCallerPlanBudget: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/pin-rail-position-distance-lookup",
  title: "Pin Rail Position Distance Lookup",
  description:
    "Read supplied physical plan rail/drop offsets, not mechanical line routing, rigging design, structural clearance or coordinate transformation.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRailToDropDistancesM",
      label: "Observed rail to drop distances m",
      kind: "numberList",
    },
    {
      id: "offsetsAboveCallerPlanBudget",
      label: "Offsets above caller plan budget",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      pinRailLocalCoordinatesM:
        value.pinRailLocalCoordinatesM as readonly (readonly number[])[],
      correspondingLineDropCoordinatesM:
        value.correspondingLineDropCoordinatesM as readonly (readonly number[])[],
      callerMaximumLateralOffsetM: value.callerMaximumLateralOffsetM as number,
    }),
});
export const run = tool.execute;
export default tool;
