import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  count,
  aligned,
  totalCount,
} from "../shared.js";
export type Input = Readonly<{
  readonly interiorPageCountsByStock: readonly number[];
  readonly sheetCalipersMmByStock: readonly number[];
  readonly additionalInsertedSheets: number;
  readonly insertSheetCaliperMm: number;
  readonly callerBindingAllowanceMm: number;
}>;
export type Output = Readonly<{
  readonly interiorLeafCount: number;
  readonly uncompressedPaperBlockMm: number;
  readonly modelBoundSpineWidthMm: number;
}>;
const inputFields = [
  {
    id: "interiorPageCountsByStock",
    label: "Interior page counts by stock",
    kind: "numberList",
  },
  {
    id: "sheetCalipersMmByStock",
    label: "Sheet calipers mm by stock",
    kind: "numberList",
  },
  {
    id: "additionalInsertedSheets",
    label: "Additional inserted sheets",
    kind: "number",
  },
  {
    id: "insertSheetCaliperMm",
    label: "Insert sheet caliper mm",
    kind: "number",
  },
  {
    id: "callerBindingAllowanceMm",
    label: "Caller binding allowance mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sheetCalipersMmByStock.forEach((v) =>
    nonnegative(v, "sheetCalipersMmByStock"),
  );
  nonnegative(input.insertSheetCaliperMm, "insertSheetCaliperMm");
  nonnegative(input.callerBindingAllowanceMm, "callerBindingAllowanceMm");
  input.interiorPageCountsByStock.forEach((v) =>
    count(v, "interiorPageCountsByStock"),
  );
  count(input.additionalInsertedSheets, "additionalInsertedSheets");
  aligned(
    input.interiorPageCountsByStock,
    input.sheetCalipersMmByStock,
    "interiorPageCountsByStock",
  );
  if (input.interiorPageCountsByStock.some((v) => v % 2))
    simpleError(
      "pages",
      "Each stock page inventory must correspond to whole two-sided sheets.",
    );
  const leaves = totalCount(
      input.interiorPageCountsByStock.map((v) => v / 2),
      "leaves",
    ),
    block =
      input.interiorPageCountsByStock.reduce(
        (s, v, i) => s + (v / 2) * input.sheetCalipersMmByStock[i],
        0,
      ) +
      input.additionalInsertedSheets * input.insertSheetCaliperMm;
  return {
    interiorLeafCount: leaves,
    uncompressedPaperBlockMm: block,
    modelBoundSpineWidthMm: block + input.callerBindingAllowanceMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  interiorPageCountsByStock: [100, 200],
  sheetCalipersMmByStock: [0.1, 0.08],
  additionalInsertedSheets: 2,
  insertSheetCaliperMm: 0.2,
  callerBindingAllowanceMm: 1,
} satisfies Input;
export const exampleOutput = {
  interiorLeafCount: 150,
  uncompressedPaperBlockMm: 13.4,
  modelBoundSpineWidthMm: 14.4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/book-spine-width-pages-caliper",
  title: "Book Spine Width From Pages and Caliper",
  description:
    "Budget bound spine from heterogeneous page/sheet inventories, measured calipers, inserts and caller binding allowance; pages are two per sheet, no universal binding compression or print-ready approval.",
  inputs: inputFields,
  outputs: [
    { id: "interiorLeafCount", label: "Interior leaf count", kind: "number" },
    {
      id: "uncompressedPaperBlockMm",
      label: "Uncompressed paper block mm",
      kind: "number",
    },
    {
      id: "modelBoundSpineWidthMm",
      label: "Model bound spine width mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      interiorPageCountsByStock:
        value.interiorPageCountsByStock as readonly number[],
      sheetCalipersMmByStock: value.sheetCalipersMmByStock as readonly number[],
      additionalInsertedSheets: value.additionalInsertedSheets as number,
      insertSheetCaliperMm: value.insertSheetCaliperMm as number,
      callerBindingAllowanceMm: value.callerBindingAllowanceMm as number,
    }),
});
export const run = tool.execute;
export default tool;
