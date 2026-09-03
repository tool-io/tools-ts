import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, firstFit } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly requiredLumberPieceLengthsMm: readonly number[];
  readonly callerVerifiedPieceMaterialGrainClasses: readonly string[];
  readonly availableStockBoardLengthsMm: readonly number[];
  readonly callerVerifiedStockMaterialGrainClasses: readonly string[];
  readonly sawKerfAfterEachPieceMm: number;
}>;
export type Output = Readonly<{
  readonly pieceStockIndices: readonly number[];
  readonly usedStockIndices: readonly number[];
  readonly remainingUsedStockMm: readonly number[];
  readonly unassignedPieceIndices: readonly number[];
  readonly globalOptimalityEstablished: boolean;
}>;
const inputFields = [
  {
    id: "requiredLumberPieceLengthsMm",
    label: "Required lumber piece lengths mm",
    kind: "numberList",
  },
  {
    id: "callerVerifiedPieceMaterialGrainClasses",
    label: "Caller verified piece material grain classes",
    kind: "stringList",
  },
  {
    id: "availableStockBoardLengthsMm",
    label: "Available stock board lengths mm",
    kind: "numberList",
  },
  {
    id: "callerVerifiedStockMaterialGrainClasses",
    label: "Caller verified stock material grain classes",
    kind: "stringList",
  },
  {
    id: "sawKerfAfterEachPieceMm",
    label: "Saw kerf after each piece mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const layout = firstFit(
    input.requiredLumberPieceLengthsMm,
    input.callerVerifiedPieceMaterialGrainClasses,
    input.availableStockBoardLengthsMm,
    input.callerVerifiedStockMaterialGrainClasses,
    input.sawKerfAfterEachPieceMm,
  );
  return { ...layout, globalOptimalityEstablished: false };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requiredLumberPieceLengthsMm: [6, 4],
  callerVerifiedPieceMaterialGrainClasses: ["a", "a"],
  availableStockBoardLengthsMm: [11, 6],
  callerVerifiedStockMaterialGrainClasses: ["a", "a"],
  sawKerfAfterEachPieceMm: 1,
} satisfies Input;
export const exampleOutput = {
  pieceStockIndices: [0, 1],
  usedStockIndices: [0, 1],
  remainingUsedStockMm: [4, 1],
  unassignedPieceIndices: [],
  globalOptimalityEstablished: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/lumber-cut-list-optimization",
  title: "Lumber Cut List Optimization",
  description:
    "Bounded deterministic descending first-fit actual heterogeneous lumber/grain-class stock allocation, kerf charged after EVERY piece including last; heuristic global optimum explicitly NOT established. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "pieceStockIndices",
      label: "Piece stock indices",
      kind: "numberList",
    },
    { id: "usedStockIndices", label: "Used stock indices", kind: "numberList" },
    {
      id: "remainingUsedStockMm",
      label: "Remaining used stock mm",
      kind: "numberList",
    },
    {
      id: "unassignedPieceIndices",
      label: "Unassigned piece indices",
      kind: "numberList",
    },
    {
      id: "globalOptimalityEstablished",
      label: "Global optimality established",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      requiredLumberPieceLengthsMm:
        value.requiredLumberPieceLengthsMm as readonly number[],
      callerVerifiedPieceMaterialGrainClasses:
        value.callerVerifiedPieceMaterialGrainClasses as readonly string[],
      availableStockBoardLengthsMm:
        value.availableStockBoardLengthsMm as readonly number[],
      callerVerifiedStockMaterialGrainClasses:
        value.callerVerifiedStockMaterialGrainClasses as readonly string[],
      sawKerfAfterEachPieceMm: value.sawKerfAfterEachPieceMm as number,
    }),
});
export const run = tool.execute;
export default tool;
