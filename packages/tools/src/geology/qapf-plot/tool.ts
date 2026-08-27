import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QapfPlotInput = {
  readonly quartzVolPct: number;
  readonly alkaliFeldsparVolPct: number;
  readonly plagioclaseVolPct: number;
  readonly feldspathoidVolPct: number;
};

export type QapfPlotOutput = {
  readonly qNormalized: number;
  readonly apNormalized: number;
  readonly fNormalized: number;
  readonly plotTriangle: "qap" | "qaf";
};

const nonNegative = (value: number): boolean =>
  typeof value === "number" && value >= 0 && Number.isFinite(value);

export const calculateQapfPlot = (input: QapfPlotInput): QapfPlotOutput => {
  for (const key of [
    "quartzVolPct",
    "alkaliFeldsparVolPct",
    "plagioclaseVolPct",
    "feldspathoidVolPct",
  ] as const) {
    if (!nonNegative(input[key]))
      simpleError(
        key,
        "Modal percentages must be finite and non-negative.",
        "invalid_mode",
      );
  }
  const total =
    input.quartzVolPct +
    input.alkaliFeldsparVolPct +
    input.plagioclaseVolPct +
    input.feldspathoidVolPct;
  if (total <= 0)
    simpleError(
      "quartzVolPct",
      "At least one modal value must be positive.",
      "invalid_mode",
    );
  if (
    input.feldspathoidVolPct > 0 &&
    input.alkaliFeldsparVolPct + input.plagioclaseVolPct > 0
  )
    simpleError(
      "feldspathoidVolPct",
      "QAPF plots either feldspar or feldspathoid; both given.",
      "mutually_exclusive",
    );
  const fNormalized = (100 * input.feldspathoidVolPct) / total;
  return {
    qNormalized: (100 * input.quartzVolPct) / total,
    apNormalized:
      (100 * (input.alkaliFeldsparVolPct + input.plagioclaseVolPct)) / total,
    fNormalized,
    plotTriangle: fNormalized > 0 ? "qaf" : "qap",
  };
};

export const qapfPlotExample = {
  input: {
    quartzVolPct: 20,
    alkaliFeldsparVolPct: 30,
    plagioclaseVolPct: 50,
    feldspathoidVolPct: 0,
  },
  output: {
    qNormalized: 20,
    apNormalized: 80,
    fNormalized: 0,
    plotTriangle: "qap",
  },
} satisfies ToolExample<QapfPlotInput, QapfPlotOutput>;

export const qapfPlotTool = createSimpleTool({
  id: "geology/qapf-plot",
  title: "QAPF Plot Calculator",
  description:
    "Normalize modal quartz, alkali feldspar, plagioclase and feldspathoid contents to QAPF coordinates and pick the plotting triangle.",
  inputs: [
    {
      description: "Quartz modal volume percent.",
      id: "quartzVolPct",
      kind: "number",
      label: "Q",
      minimum: 0,
    },
    {
      description: "Alkali feldspar modal volume percent.",
      id: "alkaliFeldsparVolPct",
      kind: "number",
      label: "A",
      minimum: 0,
    },
    {
      description: "Plagioclase modal volume percent.",
      id: "plagioclaseVolPct",
      kind: "number",
      label: "P",
      minimum: 0,
    },
    {
      description: "Feldspathoid modal volume percent.",
      id: "feldspathoidVolPct",
      kind: "number",
      label: "F",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Normalized quartz coordinate (percent of Q+A+P+F).",
      id: "qNormalized",
      kind: "number",
      label: "Q%",
    },
    {
      description: "Normalized combined feldspar coordinate.",
      id: "apNormalized",
      kind: "number",
      label: "A+P%",
    },
    {
      description: "Normalized feldspathoid coordinate.",
      id: "fNormalized",
      kind: "number",
      label: "F%",
    },
    {
      description: "Triangle selected by the IUGS double-triangle rule.",
      id: "plotTriangle",
      enum: ["qap", "qaf"],
      kind: "string",
      label: "Triangle",
    },
  ],
  calculate: (input) => calculateQapfPlot(input as unknown as QapfPlotInput),
});

export const runQapfPlot = qapfPlotTool.execute;
export default qapfPlotTool;
