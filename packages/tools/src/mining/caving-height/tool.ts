import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  nonnegative,
  crossings,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedCaveVerticalCoordinatesM: readonly number[];
  readonly observedCaveVoidFractions: readonly number[];
  readonly callerCaveBoundaryVoidFraction: number;
}>;
export type Output = Readonly<{
  readonly observedCaveBoundaryHeightCrossingsM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCaveVerticalCoordinatesM",
    label: "Observed cave vertical coordinates m",
    kind: "numberList",
  },
  {
    id: "observedCaveVoidFractions",
    label: "Observed cave void fractions",
    kind: "numberList",
  },
  {
    id: "callerCaveBoundaryVoidFraction",
    label: "Caller cave boundary void fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCaveVerticalCoordinatesM.forEach((v) =>
    nonnegative(v, "height"),
  );
  input.observedCaveVoidFractions.forEach((v) => fraction(v, "void"));
  fraction(input.callerCaveBoundaryVoidFraction, "boundary");
  return {
    observedCaveBoundaryHeightCrossingsM: crossings(
      input.observedCaveVerticalCoordinatesM,
      input.observedCaveVoidFractions,
      input.callerCaveBoundaryVoidFraction,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCaveVerticalCoordinatesM: [1, 2, 3],
  observedCaveVoidFractions: [0.2, 0.4, 0.8],
  callerCaveBoundaryVoidFraction: 0.6,
} satisfies Input;
export const exampleOutput = {
  observedCaveBoundaryHeightCrossingsM: [2.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/caving-height",
  title: "Caving Height Calculator",
  description:
    "Extract actual caving boundary height crossings from independently measured vertical void fractions and caller boundary criterion, all/no crossings retained, no extrapolation, unobserved rock-bulking model, support design or mine stability assurance.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCaveBoundaryHeightCrossingsM",
      label: "Observed cave boundary height crossings m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCaveVerticalCoordinatesM:
        value.observedCaveVerticalCoordinatesM as readonly number[],
      observedCaveVoidFractions:
        value.observedCaveVoidFractions as readonly number[],
      callerCaveBoundaryVoidFraction:
        value.callerCaveBoundaryVoidFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
