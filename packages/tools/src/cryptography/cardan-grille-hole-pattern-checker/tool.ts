import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, points } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly grilleSize: number;
  readonly holeRowColumnPairs: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly rotationCoverageCounts: readonly (readonly number[])[];
  readonly uncoveredCells: number;
  readonly overlappedCells: number;
  readonly validFourRotationGrille: boolean;
}>;
const inputFields = [
  { id: "grilleSize", label: "Grille size", kind: "number" },
  { id: "holeRowColumnPairs", label: "Hole row column pairs", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.grilleSize, "size", 2, 64);
  if (input.grilleSize % 2)
    simpleError("size", "Even square rotating Cardan grille required.");
  points(input.holeRowColumnPairs);
  const n = input.grilleSize,
    coverage = Array.from({ length: n }, () => Array<number>(n).fill(0));
  input.holeRowColumnPairs.forEach((p) => {
    p.forEach((v) => bounded(v, "hole", 0, n - 1));
    let [r, c] = p;
    for (let turn = 0; turn < 4; turn++) {
      coverage[r][c]++;
      [r, c] = [c, n - 1 - r];
    }
  });
  const flat = coverage.flat(),
    uncovered = flat.filter((v) => !v).length,
    overlapped = flat.filter((v) => v > 1).length;
  return {
    rotationCoverageCounts: coverage,
    uncoveredCells: uncovered,
    overlappedCells: overlapped,
    validFourRotationGrille: !uncovered && !overlapped,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  grilleSize: 2,
  holeRowColumnPairs: [[0, 0]],
} satisfies Input;
export const exampleOutput = {
  rotationCoverageCounts: [
    [1, 1],
    [1, 1],
  ],
  uncoveredCells: 0,
  overlappedCells: 0,
  validFourRotationGrille: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/cardan-grille-hole-pattern-checker",
  title: "Cardan Grille Hole Pattern Check",
  description:
    "Audit actual four90° rotated caller hole pattern coverage, overlaps and uncovered cells retained, bounded even square; no security guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "rotationCoverageCounts",
      label: "Rotation coverage counts",
      kind: "matrix",
    },
    { id: "uncoveredCells", label: "Uncovered cells", kind: "number" },
    { id: "overlappedCells", label: "Overlapped cells", kind: "number" },
    {
      id: "validFourRotationGrille",
      label: "Valid four rotation grille",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      grilleSize: value.grilleSize as number,
      holeRowColumnPairs:
        value.holeRowColumnPairs as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
