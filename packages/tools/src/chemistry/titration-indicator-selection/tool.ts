import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
const INDICATORS: Record<string, readonly [number, number]> = {
  "methyl orange": [3.1, 4.4],
  "bromophenol blue": [3.0, 4.6],
  "methyl red": [4.4, 6.2],
  "bromothymol blue": [6.0, 7.6],
  phenolphthalein: [8.2, 10.0],
};
export const titrationIndicatorSelectionTool = createSimpleTool({
  id: "chemistry/titration-indicator-selection",
  title: "Titration Indicator Selection Tool",
  description:
    "Select an appropriate acid-base indicator whose transition range brackets the equivalence point pH.",
  inputs: [
    {
      id: "equivalencePh",
      label: "Equivalence pH",
      kind: "number",
      description: "Expected pH at the equivalence point.",
    },
  ],
  outputs: [
    {
      id: "indicator",
      label: "Indicator",
      kind: "string",
      description: "Name of a suitable indicator.",
    },
  ],
  calculate: (input) => {
    const eqPh = input.equivalencePh as number;
    for (const [name, range] of Object.entries(INDICATORS)) {
      if (eqPh >= range[0]! && eqPh <= range[1]!) return { indicator: name };
    }
    return { indicator: "no suitable indicator found" };
  },
});
export const runTitrationIndicatorSelection =
  titrationIndicatorSelectionTool.execute;
export default titrationIndicatorSelectionTool;

export type TitrationIndicatorSelectionInput = {
  readonly equivalencePh: number;
};

export type TitrationIndicatorSelectionOutput = {
  readonly indicator: string;
};

export const titrationIndicatorSelectionExample = {
  input: {
    equivalencePh: 1,
  },
  output: {
    indicator: "no suitable indicator found",
  },
} satisfies ToolExample<
  TitrationIndicatorSelectionInput,
  TitrationIndicatorSelectionOutput
>;
