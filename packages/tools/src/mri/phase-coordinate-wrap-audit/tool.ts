import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly objectPositionsMm: readonly number[];
  readonly phaseFovMm: number;
}>;
export type Output = Readonly<{
  readonly wrappedPositionsMm: readonly number[];
  readonly wrappedObjectIndexes: readonly number[];
}>;
const inputFields = [
  {
    id: "objectPositionsMm",
    label: "Object positions mm",
    kind: "numberList",
    unit: "mm",
  },
  { id: "phaseFovMm", label: "Phase fov mm", kind: "number", unit: "mm" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.objectPositionsMm.length)
    simpleError("objectPositionsMm", "Nonempty object positions required.");
  positive(input.phaseFovMm, "phaseFovMm");
  const f = input.phaseFovMm,
    wrappedPositionsMm = input.objectPositionsMm.map(
      (v) => ((((v + f / 2) % f) + f) % f) - f / 2,
    );
  return {
    wrappedPositionsMm,
    wrappedObjectIndexes: input.objectPositionsMm.flatMap((v, i) =>
      v < -f / 2 || v >= f / 2 ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  objectPositionsMm: [-150, 0, 150],
  phaseFovMm: 200,
} satisfies Input;
export const exampleOutput = {
  wrappedPositionsMm: [50, 0, -50],
  wrappedObjectIndexes: [0, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/phase-coordinate-wrap-audit",
  title: "Aliasing Artifact Checker",
  description:
    "Map one-dimensional phase positions into the centered half-open FOV and flag geometric wraps; coil sensitivity and suppression can change observed aliasing.",
  inputs: inputFields,
  outputs: [
    {
      id: "wrappedPositionsMm",
      label: "Wrapped positions mm",
      kind: "numberList",
      unit: "mm",
    },
    {
      id: "wrappedObjectIndexes",
      label: "Wrapped object indexes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      objectPositionsMm: value.objectPositionsMm as readonly number[],
      phaseFovMm: value.phaseFovMm as number,
    }),
});
export const run = tool.execute;
export default tool;
