import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly cabinetOuterHeightMm: number;
  readonly cabinetOuterWidthMm: number;
  readonly cabinetOuterDepthMm: number;
  readonly callerPanelThicknessMm: number;
  readonly callerBackThicknessMm: number;
  readonly callerInteriorShelfCount: number;
}>;
export type Output = Readonly<{
  readonly partIds: readonly string[];
  readonly partLengthsMm: readonly number[];
  readonly partWidthsMm: readonly number[];
  readonly partCounts: readonly number[];
  readonly totalNominalPanelAreaMm2: number;
}>;
const inputFields = [
  {
    id: "cabinetOuterHeightMm",
    label: "Cabinet outer height mm",
    kind: "number",
  },
  {
    id: "cabinetOuterWidthMm",
    label: "Cabinet outer width mm",
    kind: "number",
  },
  {
    id: "cabinetOuterDepthMm",
    label: "Cabinet outer depth mm",
    kind: "number",
  },
  {
    id: "callerPanelThicknessMm",
    label: "Caller panel thickness mm",
    kind: "number",
  },
  {
    id: "callerBackThicknessMm",
    label: "Caller back thickness mm",
    kind: "number",
  },
  {
    id: "callerInteriorShelfCount",
    label: "Caller interior shelf count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.cabinetOuterHeightMm, "cabinetOuterHeightMm");
  positive(input.cabinetOuterWidthMm, "cabinetOuterWidthMm");
  positive(input.cabinetOuterDepthMm, "cabinetOuterDepthMm");
  positive(input.callerPanelThicknessMm, "callerPanelThicknessMm");
  positive(input.callerBackThicknessMm, "callerBackThicknessMm");
  bounded(input.callerInteriorShelfCount, "shelves", 0, 128);
  const width = input.cabinetOuterWidthMm - 2 * input.callerPanelThicknessMm,
    depth = input.cabinetOuterDepthMm - input.callerBackThicknessMm;
  positive(width, "inside width");
  positive(depth, "shelf depth");
  positive(
    input.cabinetOuterHeightMm - 2 * input.callerPanelThicknessMm,
    "inside height",
  );
  const lengths = [
      input.cabinetOuterHeightMm,
      width,
      width,
      input.cabinetOuterHeightMm,
    ],
    widths = [
      input.cabinetOuterDepthMm,
      input.cabinetOuterDepthMm,
      depth,
      input.cabinetOuterWidthMm,
    ],
    counts = [2, 2, input.callerInteriorShelfCount, 1];
  return {
    partIds: ["sides", "top-bottom", "shelves", "back"],
    partLengthsMm: lengths,
    partWidthsMm: widths,
    partCounts: counts,
    totalNominalPanelAreaMm2: sum(
      lengths.map((v, i) => v * widths[i] * counts[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cabinetOuterHeightMm: 100,
  cabinetOuterWidthMm: 80,
  cabinetOuterDepthMm: 40,
  callerPanelThicknessMm: 2,
  callerBackThicknessMm: 1,
  callerInteriorShelfCount: 1,
} satisfies Input;
export const exampleOutput = {
  partIds: ["sides", "top-bottom", "shelves", "back"],
  partLengthsMm: [100, 76, 76, 100],
  partWidthsMm: [40, 40, 39, 80],
  partCounts: [2, 2, 1, 1],
  totalNominalPanelAreaMm2: 25044,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/cabinet-carcass-cut-list",
  title: "Cabinet Carcass Cut List Generator",
  description:
    "Build explicit butt-jointed between-side top/bottom and full overlay-back cabinet carcass nominal cut ledger, shelves stop at back; no kerf, edgeband, joinery strength or stock nesting assumptions. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    { id: "partIds", label: "Part ids", kind: "stringList" },
    { id: "partLengthsMm", label: "Part lengths mm", kind: "numberList" },
    { id: "partWidthsMm", label: "Part widths mm", kind: "numberList" },
    { id: "partCounts", label: "Part counts", kind: "numberList" },
    {
      id: "totalNominalPanelAreaMm2",
      label: "Total nominal panel area mm2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cabinetOuterHeightMm: value.cabinetOuterHeightMm as number,
      cabinetOuterWidthMm: value.cabinetOuterWidthMm as number,
      cabinetOuterDepthMm: value.cabinetOuterDepthMm as number,
      callerPanelThicknessMm: value.callerPanelThicknessMm as number,
      callerBackThicknessMm: value.callerBackThicknessMm as number,
      callerInteriorShelfCount: value.callerInteriorShelfCount as number,
    }),
});
export const run = tool.execute;
export default tool;
