import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WorkbenchViseJawWidthInput = Readonly<{
  readonly workpieceWidthMillimeters: number;
  readonly sideMarginMillimeters: number;
}>;
export type WorkbenchViseJawWidthOutput = Readonly<{
  readonly jawWidthMillimeters: number;
}>;

export const calculateWorkbenchViseJawWidth = (
  x: WorkbenchViseJawWidthInput,
): WorkbenchViseJawWidthOutput => {
  if (
    !Number.isFinite(x.workpieceWidthMillimeters) ||
    x.workpieceWidthMillimeters < 0
  )
    simpleError(
      "workpieceWidthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.sideMarginMillimeters) || x.sideMarginMillimeters < 0)
    simpleError("sideMarginMillimeters", "Provide a finite number at least 0.");
  const jawWidthMillimeters =
    x.workpieceWidthMillimeters + 2 * x.sideMarginMillimeters;
  if (!Number.isFinite(jawWidthMillimeters))
    simpleError(
      "jawWidthMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    jawWidthMillimeters: Object.is(jawWidthMillimeters, -0)
      ? 0
      : jawWidthMillimeters,
  };
};

export const example = {
  input: { workpieceWidthMillimeters: 150, sideMarginMillimeters: 20 },
  output: { jawWidthMillimeters: 190 },
} satisfies ToolExample<
  WorkbenchViseJawWidthInput,
  WorkbenchViseJawWidthOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/workbench-vise-jaw-width",
  title: "Workbench Vise Jaw Width",
  description:
    "Minimum vise jaw width needed to cover a workpiece plus equal clamping margins on both sides.",
  inputs: [
    {
      id: "workpieceWidthMillimeters",
      kind: "number",
      label: "Workpiece Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "sideMarginMillimeters",
      kind: "number",
      label: "Side Margin Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "jawWidthMillimeters",
      kind: "number",
      label: "Jaw Width Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateWorkbenchViseJawWidth({
      workpieceWidthMillimeters: input.workpieceWidthMillimeters as number,
      sideMarginMillimeters: input.sideMarginMillimeters as number,
    }),
});
export const workbenchViseJawWidthTool = tool;
export const runWorkbenchViseJawWidth = tool.execute;
export default tool;
