import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CompactionDegreeInput = Readonly<{
  readonly fieldDryDensityKgPerM3: number;
  readonly maximumDryDensityKgPerM3: number;
}>;
export type CompactionDegreeOutput = Readonly<{
  readonly compactionPercent: number;
}>;

export const calculateCompactionDegree = (
  x: CompactionDegreeInput,
): CompactionDegreeOutput => {
  if (
    !Number.isFinite(x.fieldDryDensityKgPerM3) ||
    x.fieldDryDensityKgPerM3 < 0
  )
    simpleError(
      "fieldDryDensityKgPerM3",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.maximumDryDensityKgPerM3) ||
    x.maximumDryDensityKgPerM3 < 0
  )
    simpleError(
      "maximumDryDensityKgPerM3",
      "Provide a finite number at least 0.",
    );
  const compactionPercent =
    (100 * x.fieldDryDensityKgPerM3) / x.maximumDryDensityKgPerM3;
  if (!Number.isFinite(compactionPercent))
    simpleError(
      "compactionPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    compactionPercent: Object.is(compactionPercent, -0) ? 0 : compactionPercent,
  };
};

export const example = {
  input: { fieldDryDensityKgPerM3: 1800, maximumDryDensityKgPerM3: 2000 },
  output: { compactionPercent: 90 },
} satisfies ToolExample<CompactionDegreeInput, CompactionDegreeOutput>;

export const tool = createSimpleTool({
  id: "engineering/compaction-degree",
  title: "Compaction Degree",
  description:
    "Dry-density compaction percentage relative to a specified maximum dry density.",
  inputs: [
    {
      id: "fieldDryDensityKgPerM3",
      kind: "number",
      label: "Field Dry Density Kg Per M3",
      unit: "kg/m³",
      minimum: 0,
    },
    {
      id: "maximumDryDensityKgPerM3",
      kind: "number",
      label: "Maximum Dry Density Kg Per M3",
      unit: "kg/m³",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "compactionPercent",
      kind: "number",
      label: "Compaction Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateCompactionDegree({
      fieldDryDensityKgPerM3: input.fieldDryDensityKgPerM3 as number,
      maximumDryDensityKgPerM3: input.maximumDryDensityKgPerM3 as number,
    }),
});
export const compactionDegreeTool = tool;
export const runCompactionDegree = tool.execute;
export default tool;
