import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const INDICATOR_PKA: Readonly<Record<string, number>> = {
  bromophenol_blue: 4.1,
  bromothymol_blue: 7.1,
  methyl_orange: 3.7,
  methyl_red: 5.1,
  phenol_red: 7.9,
  phenolphthalein: 9.7,
};

export const indicatorPkaLookupTool = createSimpleTool({
  id: "chemistry/indicator-pka-lookup",
  title: "Indicator pKa Lookup",
  description: "Look up approximate pKa of common indicators.",
  inputs: [{ id: "indicatorName", label: "Indicator name", kind: "string" }],
  outputs: [{ id: "approxPka", label: "Approx pKa", kind: "number" }],
  calculate: (input) => {
    const key = String(input.indicatorName)
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/gu, "_");
    const approxPka = INDICATOR_PKA[key];
    if (approxPka === undefined)
      simpleError(
        "indicatorName",
        "Choose a supported acid-base indicator.",
        "not_found",
      );
    return { approxPka };
  },
});
export default indicatorPkaLookupTool;
export const runIndicatorPkaLookup = indicatorPkaLookupTool.execute;

export type IndicatorPkaLookupInput = {
  readonly indicatorName: string;
};

export type IndicatorPkaLookupOutput = {
  readonly approxPka: number;
};

export const indicatorPkaLookupExample = {
  input: {
    indicatorName: "bromothymol blue",
  },
  output: {
    approxPka: 7.1,
  },
} satisfies ToolExample<IndicatorPkaLookupInput, IndicatorPkaLookupOutput>;
