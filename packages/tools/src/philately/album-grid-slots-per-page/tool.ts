import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  exactProduct,
  slotCapacity,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly usableWidthMm: number;
  readonly usableHeightMm: number;
  readonly mountWidthMm: number;
  readonly mountHeightMm: number;
  readonly columnGapMm: number;
  readonly rowGapMm: number;
}>;
export type Output = Readonly<{
  readonly columns: number;
  readonly rows: number;
  readonly slots: number;
}>;
const inputFields = [
  { id: "usableWidthMm", label: "Usable width mm", kind: "number" },
  { id: "usableHeightMm", label: "Usable height mm", kind: "number" },
  { id: "mountWidthMm", label: "Mount width mm", kind: "number" },
  { id: "mountHeightMm", label: "Mount height mm", kind: "number" },
  { id: "columnGapMm", label: "Column gap mm", kind: "number" },
  { id: "rowGapMm", label: "Row gap mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.mountWidthMm, "mountWidthMm");
  positive(input.mountHeightMm, "mountHeightMm");
  nonnegative(input.usableWidthMm, "usableWidthMm");
  nonnegative(input.usableHeightMm, "usableHeightMm");
  nonnegative(input.columnGapMm, "columnGapMm");
  nonnegative(input.rowGapMm, "rowGapMm");
  const columns = slotCapacity(
      input.usableWidthMm,
      input.mountWidthMm,
      input.columnGapMm,
    ),
    rows = slotCapacity(
      input.usableHeightMm,
      input.mountHeightMm,
      input.rowGapMm,
    );
  return { columns: columns, rows: rows, slots: exactProduct(columns, rows) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  usableWidthMm: 100,
  usableHeightMm: 150,
  mountWidthMm: 22,
  mountHeightMm: 32,
  columnGapMm: 3,
  rowGapMm: 3,
} satisfies Input;
export const exampleOutput = {
  columns: 4,
  rows: 4,
  slots: 16,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/album-grid-slots-per-page",
  title: "Album Page Grid Slots per Page Calculator",
  description:
    "Count aligned unrotated mount slots from usable page dimensions and explicit gaps; margins already excluded. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "columns", label: "Columns", kind: "number" },
    { id: "rows", label: "Rows", kind: "number" },
    { id: "slots", label: "Slots", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      usableWidthMm: value.usableWidthMm as number,
      usableHeightMm: value.usableHeightMm as number,
      mountWidthMm: value.mountWidthMm as number,
      mountHeightMm: value.mountHeightMm as number,
      columnGapMm: value.columnGapMm as number,
      rowGapMm: value.rowGapMm as number,
    }),
});
export const run = tool.execute;
export default tool;
