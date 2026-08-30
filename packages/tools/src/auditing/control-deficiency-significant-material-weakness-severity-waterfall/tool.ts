import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ControlDeficiencyWaterfallInput = {
  readonly deficiencies: ReadonlyArray<ReadonlyArray<number>>;
};

export type ControlDeficiencyWaterfallOutput = {
  readonly highestSeverity:
    | "control_deficiency"
    | "material_weakness"
    | "none"
    | "significant_deficiency";
  readonly severeDeficiencyCount: number;
  readonly totalAmount: number;
};

export const summarizeControlDeficiencies = (
  input: ControlDeficiencyWaterfallInput,
): ControlDeficiencyWaterfallOutput => {
  if (!Array.isArray(input.deficiencies))
    simpleError(
      "deficiencies",
      "Deficiencies must be an array.",
      "deficiencies_required",
    );
  let highestCode = 0;
  let severeDeficiencyCount = 0;
  let totalAmount = 0;
  for (const [index, row] of input.deficiencies.entries()) {
    if (!Array.isArray(row) || row.length !== 2)
      simpleError(
        `deficiencies.${index}`,
        "Each row must contain a severity code and amount.",
        "invalid_deficiency_row",
      );
    const [severityCode, amount] = row;
    if (
      severityCode! < 0 ||
      severityCode! > 3 ||
      !Number.isInteger(severityCode)
    )
      simpleError(
        `deficiencies.${index}.0`,
        "Severity codes must be 0, 1, 2, or 3.",
        "invalid_deficiency_severity",
      );
    if (!Number.isFinite(amount) || amount < 0)
      simpleError(
        `deficiencies.${index}.1`,
        "Deficiency amounts must be finite and nonnegative.",
        "invalid_deficiency_amount",
      );
    highestCode = Math.max(highestCode, severityCode!);
    if (severityCode! >= 2) severeDeficiencyCount += 1;
    const nextTotal = totalAmount + amount!;
    if (!Number.isFinite(nextTotal))
      simpleError(
        `deficiencies.${index}.1`,
        "The deficiency total is outside the representable numeric range.",
        "result_not_finite",
      );
    totalAmount = nextTotal;
  }
  return {
    highestSeverity:
      highestCode === 3
        ? "material_weakness"
        : highestCode === 2
          ? "significant_deficiency"
          : highestCode === 1
            ? "control_deficiency"
            : "none",
    severeDeficiencyCount,
    totalAmount: totalAmount === 0 ? 0 : totalAmount,
  };
};

export const controlDeficiencyWaterfallExample = {
  input: {
    deficiencies: [
      [1, 10_000],
      [2, 25_000],
      [3, 50_000],
    ],
  },
  output: {
    highestSeverity: "material_weakness",
    severeDeficiencyCount: 2,
    totalAmount: 85_000,
  },
} satisfies ToolExample<
  ControlDeficiencyWaterfallInput,
  ControlDeficiencyWaterfallOutput
>;

export const controlDeficiencyWaterfallTool = createSimpleTool({
  calculate: (input) =>
    summarizeControlDeficiencies({
      deficiencies: input.deficiencies as number[][],
    }),
  description:
    "Summarize caller-coded control deficiencies by total amount, severe-item count, and highest severity, where codes progress from control deficiency to material weakness.",
  id: "auditing/control-deficiency-significant-material-weakness-severity-waterfall",
  inputs: [
    {
      description:
        "Rows containing severity code 0 through 3 and a nonnegative deficiency amount.",
      id: "deficiencies",
      kind: "matrix",
      label: "Control deficiencies",
    },
  ],
  outputs: [
    {
      enum: [
        "control_deficiency",
        "material_weakness",
        "none",
        "significant_deficiency",
      ],
      id: "highestSeverity",
      kind: "string",
      label: "Highest severity",
    },
    {
      id: "severeDeficiencyCount",
      kind: "integer",
      label: "Significant or severe items",
      minimum: 0,
    },
    {
      id: "totalAmount",
      kind: "number",
      label: "Total deficiency amount",
      minimum: 0,
    },
  ],
  title: "Control Deficiency Significant Material Weakness Severity Waterfall",
});

export const runControlDeficiencyWaterfall =
  controlDeficiencyWaterfallTool.execute;
export default controlDeficiencyWaterfallTool;
