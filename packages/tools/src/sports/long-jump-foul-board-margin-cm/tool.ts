import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedBoardFoulLinePositionsCm: readonly number[];
  readonly observedToePositionsAlongApproachCm: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedLegalTakeoffMarginsCm: readonly number[];
  readonly observedGeometricOverstepFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBoardFoulLinePositionsCm",
    label: "Observed board foul line positions cm",
    kind: "numberList",
  },
  {
    id: "observedToePositionsAlongApproachCm",
    label: "Observed toe positions along approach cm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedBoardFoulLinePositionsCm,
    input.observedToePositionsAlongApproachCm,
    "attempts",
  );
  const margins = input.observedBoardFoulLinePositionsCm.map(
    (v, i) => v - input.observedToePositionsAlongApproachCm[i],
  );
  return {
    signedLegalTakeoffMarginsCm: margins,
    observedGeometricOverstepFlags: margins.map((v) => (v < 0 ? 1 : 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBoardFoulLinePositionsCm: [0, 0],
  observedToePositionsAlongApproachCm: [-2, 1],
} satisfies Input;
export const exampleOutput = {
  signedLegalTakeoffMarginsCm: [2, -1],
  observedGeometricOverstepFlags: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/long-jump-foul-board-margin-cm",
  title: "Long Jump Foul Board Margin cm",
  description:
    "Audit actual one-axis long-jump toe/foul-line geometry, positive margin behind line, retaining signed overstep; not official foul detection, measurement uncertainty or flight-distance forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedLegalTakeoffMarginsCm",
      label: "Signed legal takeoff margins cm",
      kind: "numberList",
    },
    {
      id: "observedGeometricOverstepFlags",
      label: "Observed geometric overstep flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBoardFoulLinePositionsCm:
        value.observedBoardFoulLinePositionsCm as readonly number[],
      observedToePositionsAlongApproachCm:
        value.observedToePositionsAlongApproachCm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
