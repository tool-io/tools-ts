import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RedCellIndexMcvInput = {
  readonly hematocritPercent: number;
  readonly rbcMillionPerUl: number;
  readonly reportedMcvFemtoliters: number;
};

export type RedCellIndexMcvOutput = {
  readonly computedMcvFemtoliters: number;
  readonly consistent: boolean;
};

export const redCellIndexMcvExample = {
  input: {
    hematocritPercent: 45,
    rbcMillionPerUl: 5,
    reportedMcvFemtoliters: 90,
  },
  output: { computedMcvFemtoliters: 90, consistent: true },
} satisfies ToolExample<RedCellIndexMcvInput, RedCellIndexMcvOutput>;

export const redCellIndexMcvTool = createSimpleTool({
  id: "biology/red-cell-index-mcv",
  title: "MCV Cross Check",
  description:
    "Cross check a reported MCV against the computed mean corpuscular volume hematocrit x 10 / RBC and flag agreement within two femtolitres.",
  inputs: [
    {
      id: "hematocritPercent",
      label: "Hematocrit",
      kind: "number",
      unit: "%",
    },
    {
      id: "rbcMillionPerUl",
      label: "RBC count",
      kind: "number",
      unit: "million/µL",
    },
    {
      id: "reportedMcvFemtoliters",
      label: "Reported MCV",
      kind: "number",
      unit: "fL",
    },
  ],
  outputs: [
    {
      id: "computedMcvFemtoliters",
      label: "Computed MCV",
      kind: "number",
      unit: "fL",
    },
    {
      description: "True when the reported MCV agrees within two femtolitres.",
      id: "consistent",
      label: "Consistent",
      kind: "boolean",
    },
  ],
  calculate: (input) => {
    const hematocritPercent = input.hematocritPercent as number;
    const rbcMillionPerUl = input.rbcMillionPerUl as number;
    const reportedMcvFemtoliters = input.reportedMcvFemtoliters as number;
    if (hematocritPercent <= 0)
      simpleError(
        "hematocritPercent",
        "The hematocrit must be greater than zero.",
      );
    if (rbcMillionPerUl <= 0)
      simpleError(
        "rbcMillionPerUl",
        "The RBC count must be greater than zero.",
      );
    if (reportedMcvFemtoliters <= 0)
      simpleError(
        "reportedMcvFemtoliters",
        "The reported MCV must be greater than zero.",
      );
    const computedMcvFemtoliters = (hematocritPercent * 10) / rbcMillionPerUl;
    return {
      computedMcvFemtoliters,
      consistent:
        Math.abs(computedMcvFemtoliters - reportedMcvFemtoliters) <= 2,
    };
  },
});
export const runRedCellIndexMcv = redCellIndexMcvTool.execute;
export default redCellIndexMcvTool;
