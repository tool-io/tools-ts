import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TasDiagramPlotInput = {
  readonly siO2WtPercent: number;
  readonly na2OWtPercent: number;
  readonly k2OWtPercent: number;
};

export type TasDiagramPlotOutput = {
  readonly totalAlkalisWtPercent: number;
  readonly silicaWtPercent: number;
  readonly k2OToNa2ORatio: number;
  readonly silicaBand: "ultrabasic" | "basic" | "intermediate" | "acid";
};

export const calculateTasDiagramPlot = (
  input: TasDiagramPlotInput,
): TasDiagramPlotOutput => {
  for (const key of [
    "siO2WtPercent",
    "na2OWtPercent",
    "k2OWtPercent",
  ] as const) {
    const value = input[key];
    if (!(typeof value === "number" && value >= 0 && Number.isFinite(value)))
      simpleError(
        key,
        "Oxide percentages must be finite and non-negative.",
        "invalid_oxide",
      );
  }
  if (input.siO2WtPercent === 0)
    simpleError(
      "siO2WtPercent",
      "SiO2 must be greater than zero.",
      "invalid_oxide",
    );
  const totalAlkalisWtPercent = input.na2OWtPercent + input.k2OWtPercent;
  const sio2 = input.siO2WtPercent;
  const silicaBand =
    sio2 < 45
      ? "ultrabasic"
      : sio2 < 52
        ? "basic"
        : sio2 < 63
          ? "intermediate"
          : "acid";
  return {
    totalAlkalisWtPercent,
    silicaWtPercent: sio2,
    k2OToNa2ORatio:
      input.na2OWtPercent === 0
        ? input.k2OWtPercent === 0
          ? 0
          : simpleError(
              "na2OWtPercent",
              "K2O/Na2O needs Na2O greater than zero.",
              "invalid_oxide",
            )
        : input.k2OWtPercent / input.na2OWtPercent,
    silicaBand,
  };
};

export const tasDiagramPlotExample = {
  input: { siO2WtPercent: 49.5, na2OWtPercent: 3.2, k2OWtPercent: 1.1 },
  output: {
    totalAlkalisWtPercent: 4.300000000000001,
    silicaWtPercent: 49.5,
    k2OToNa2ORatio: 0.34375,
    silicaBand: "basic",
  },
} satisfies ToolExample<TasDiagramPlotInput, TasDiagramPlotOutput>;

export const tasDiagramPlotTool = createSimpleTool({
  id: "geology/tas-diagram-plot",
  title: "TAS Diagram Plot Calculator",
  description:
    "Prepare total-alkalis versus silica coordinates and the Le Bas silica band for plotting on the IUGS TAS diagram.",
  inputs: [
    {
      description: "SiO2 weight percent.",
      id: "siO2WtPercent",
      kind: "number",
      label: "SiO2",
      minimum: 0,
    },
    {
      description: "Na2O weight percent.",
      id: "na2OWtPercent",
      kind: "number",
      label: "Na2O",
      minimum: 0,
    },
    {
      description: "K2O weight percent.",
      id: "k2OWtPercent",
      kind: "number",
      label: "K2O",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Na2O + K2O in weight percent.",
      id: "totalAlkalisWtPercent",
      kind: "number",
      label: "Total alkalis",
    },
    {
      description: "SiO2 weight percent.",
      id: "silicaWtPercent",
      kind: "number",
      label: "SiO2",
    },
    {
      description: "K2O divided by Na2O.",
      id: "k2OToNa2ORatio",
      kind: "number",
      label: "K2O/Na2O",
    },
    {
      description: "TAS horizontal axis band at the given silica content.",
      id: "silicaBand",
      enum: ["ultrabasic", "basic", "intermediate", "acid"],
      kind: "string",
      label: "Silica band",
    },
  ],
  calculate: (input) =>
    calculateTasDiagramPlot(input as unknown as TasDiagramPlotInput),
});

export const runTasDiagramPlot = tasDiagramPlotTool.execute;
export default tasDiagramPlotTool;
