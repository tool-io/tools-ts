import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TickMarkLegendInput = {
  readonly legendMarks: ReadonlyArray<string>;
  readonly legendMeanings: ReadonlyArray<string>;
  readonly usedMarks: ReadonlyArray<string>;
};

export type TickMarkLegendOutput = {
  readonly resolvedCount: number;
  readonly unresolvedCount: number;
  readonly unresolvedMarks: ReadonlyArray<string>;
  readonly usedMarkCount: number;
};

export const resolveTickMarkLegend = (
  input: TickMarkLegendInput,
): TickMarkLegendOutput => {
  if (
    !Array.isArray(input.legendMarks) ||
    !Array.isArray(input.legendMeanings) ||
    !Array.isArray(input.usedMarks)
  )
    simpleError(
      "",
      "Legend marks, meanings, and used marks must be arrays.",
      "legend_data_required",
    );
  if (input.legendMarks.length !== input.legendMeanings.length)
    simpleError(
      "legendMeanings",
      "Each legend mark must have one meaning.",
      "legend_length_mismatch",
    );
  const meanings = new Map<string, string>();
  for (const [index, mark] of input.legendMarks.entries()) {
    const meaning = input.legendMeanings[index];
    if (
      typeof mark !== "string" ||
      mark.trim() === "" ||
      typeof meaning !== "string" ||
      meaning.trim() === ""
    )
      simpleError(
        `legendMarks.${index}`,
        "Legend marks and meanings must be nonempty strings.",
        "invalid_legend_entry",
      );
    const key = mark.trim().toLowerCase();
    if (meanings.has(key))
      simpleError(
        `legendMarks.${index}`,
        "Legend marks must be unique.",
        "duplicate_legend_mark",
      );
    meanings.set(key, meaning.trim());
  }
  const unresolvedMarks: string[] = [];
  for (const [index, mark] of input.usedMarks.entries())
    if (typeof mark !== "string" || mark.trim() === "")
      simpleError(
        `usedMarks.${index}`,
        "Used marks must be nonempty strings.",
        "invalid_used_mark",
      );
    else if (!meanings.has(mark.trim().toLowerCase()))
      unresolvedMarks.push(mark.trim());
  return {
    resolvedCount: input.usedMarks.length - unresolvedMarks.length,
    unresolvedCount: unresolvedMarks.length,
    unresolvedMarks,
    usedMarkCount: input.usedMarks.length,
  };
};

export const tickMarkLegendExample = {
  input: {
    legendMarks: ["A", "B"],
    legendMeanings: ["Agreed to source", "Traced to bank statement"],
    usedMarks: ["A", "B", "C"],
  },
  output: {
    resolvedCount: 2,
    unresolvedCount: 1,
    unresolvedMarks: ["C"],
    usedMarkCount: 3,
  },
} satisfies ToolExample<TickMarkLegendInput, TickMarkLegendOutput>;

export const tickMarkLegendTool = createSimpleTool({
  calculate: (input) =>
    resolveTickMarkLegend({
      legendMarks: input.legendMarks as string[],
      legendMeanings: input.legendMeanings as string[],
      usedMarks: input.usedMarks as string[],
    }),
  description:
    "Resolve used audit tick marks against a supplied mark-and-meaning legend and report every undefined mark.",
  id: "auditing/tick-mark-legend-standard-symbols-meaning-table",
  inputs: [
    { id: "legendMarks", kind: "stringList", label: "Legend marks" },
    { id: "legendMeanings", kind: "stringList", label: "Legend meanings" },
    { id: "usedMarks", kind: "stringList", label: "Used tick marks" },
  ],
  outputs: [
    {
      id: "resolvedCount",
      kind: "integer",
      label: "Resolved marks",
      minimum: 0,
    },
    {
      id: "unresolvedCount",
      kind: "integer",
      label: "Unresolved marks",
      minimum: 0,
    },
    { id: "unresolvedMarks", kind: "stringList", label: "Unresolved marks" },
    { id: "usedMarkCount", kind: "integer", label: "Used marks", minimum: 0 },
  ],
  title: "Tick Mark Legend Standard Symbols Meaning Table",
});

export const runTickMarkLegend = tickMarkLegendTool.execute;
export default tickMarkLegendTool;
