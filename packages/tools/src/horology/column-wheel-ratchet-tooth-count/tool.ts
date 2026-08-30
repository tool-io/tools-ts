import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ColumnWheelCountInput = {
  readonly columnCount: number;
  readonly strokesPerCycle: number;
};

export type ColumnWheelCountOutput = {
  readonly ratchetTeeth: number;
  readonly ratchetTeethPerColumn: number;
};

export const calculateColumnWheelRatchetTeeth = (
  input: ColumnWheelCountInput,
): ColumnWheelCountOutput => {
  if (
    !Number.isSafeInteger(input.columnCount) ||
    input.columnCount < 1 ||
    input.columnCount > 30
  )
    simpleError(
      "columnCount",
      "Column count must be an integer from 1 through 30.",
      "column_count_out_of_range",
    );
  if (
    !Number.isSafeInteger(input.strokesPerCycle) ||
    input.strokesPerCycle < 1 ||
    input.strokesPerCycle > 10
  )
    simpleError(
      "strokesPerCycle",
      "Strokes per cycle must be an integer from 1 through 10.",
      "stroke_count_out_of_range",
    );
  return {
    ratchetTeeth: input.columnCount * input.strokesPerCycle,
    ratchetTeethPerColumn: input.strokesPerCycle,
  };
};

export const columnWheelCountExample = {
  input: { columnCount: 6, strokesPerCycle: 3 },
  output: { ratchetTeeth: 18, ratchetTeethPerColumn: 3 },
} satisfies ToolExample<ColumnWheelCountInput, ColumnWheelCountOutput>;

export const columnWheelCountTool = createSimpleTool({
  calculate: (input) =>
    calculateColumnWheelRatchetTeeth({
      columnCount: input.columnCount as number,
      strokesPerCycle: input.strokesPerCycle as number,
    }),
  description:
    "Calculate ratchet teeth for a caller-specified column-wheel geometry using the documented teeth-per-column relationship.",
  id: "horology/column-wheel-ratchet-tooth-count",
  inputs: [
    {
      id: "columnCount",
      kind: "integer",
      label: "Column count",
      maximum: 30,
      minimum: 1,
    },
    {
      id: "strokesPerCycle",
      kind: "integer",
      label: "Functional strokes per cycle",
      maximum: 10,
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "ratchetTeeth",
      kind: "integer",
      label: "Calculated ratchet teeth",
      maximum: 300,
      minimum: 1,
    },
    {
      id: "ratchetTeethPerColumn",
      kind: "integer",
      label: "Ratchet teeth per column",
      maximum: 10,
      minimum: 1,
    },
  ],
  title: "Column-Wheel Ratchet Tooth Count",
});

export const runColumnWheelCount = columnWheelCountTool.execute;
export default columnWheelCountTool;
