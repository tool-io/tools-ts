import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, shape } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerTrimOccupiedKramersPairParities: readonly (readonly number[])[];
  readonly callerInversionAndTimeReversalSymmetryVerified: boolean;
}>;
export type Output = Readonly<{
  readonly trimParityProducts: readonly number[];
  readonly fuKaneTwoDimensionalZ2: number;
}>;
const inputFields = [
  {
    id: "callerTrimOccupiedKramersPairParities",
    label: "Caller trim occupied kramers pair parities",
    kind: "matrix",
  },
  {
    id: "callerInversionAndTimeReversalSymmetryVerified",
    label: "Caller inversion and time reversal symmetry verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.callerInversionAndTimeReversalSymmetryVerified ||
    input.callerTrimOccupiedKramersPairParities.length !== 4
  )
    simpleError(
      "symmetry",
      "Four 2D TRIM rows and independently verified inversion/time-reversal symmetry required.",
    );
  shape(input.callerTrimOccupiedKramersPairParities, "parities");
  if (
    input.callerTrimOccupiedKramersPairParities.some((r) =>
      r.some((v) => v !== 1 && v !== -1),
    )
  )
    simpleError(
      "parities",
      "One ±1 parity per independently established occupied Kramers pair required.",
    );
  const products = input.callerTrimOccupiedKramersPairParities.map((r) =>
    r.reduce((s, v) => s * v, 1),
  );
  return {
    trimParityProducts: products,
    fuKaneTwoDimensionalZ2: products.reduce((s, v) => s * v, 1) === -1 ? 1 : 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTrimOccupiedKramersPairParities: [
    [1, -1],
    [1, 1],
    [1, 1],
    [1, 1],
  ],
  callerInversionAndTimeReversalSymmetryVerified: true,
} satisfies Input;
export const exampleOutput = {
  trimParityProducts: [-1, 1, 1, 1],
  fuKaneTwoDimensionalZ2: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/z2-invariant",
  title: "Semiconductor Z2 Invariant Calculator",
  description:
    "Compute explicit inversion-symmetric 2D Fu–Kane parity formula over caller occupied Kramers pairs at four TRIM; not generic Wilson loop, 3D indices or discovery of band topology.",
  inputs: inputFields,
  outputs: [
    {
      id: "trimParityProducts",
      label: "Trim parity products",
      kind: "numberList",
    },
    {
      id: "fuKaneTwoDimensionalZ2",
      label: "Fu kane two dimensional z2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTrimOccupiedKramersPairParities:
        value.callerTrimOccupiedKramersPairParities as readonly (readonly number[])[],
      callerInversionAndTimeReversalSymmetryVerified:
        value.callerInversionAndTimeReversalSymmetryVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
