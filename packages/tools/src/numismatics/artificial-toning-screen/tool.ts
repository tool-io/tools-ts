import { createRiskScreen } from "../../core/operational.js";

const operation = createRiskScreen({
  description:
    "Summarize caller-observed indicators for artificial toning screen without treating the result as conclusive.",
  example: {
    abruptColorBands: true,
    recessMismatch: true,
    heatExposure: false,
    chemicalResidue: false,
  },
  highRiskAt: 2,
  id: "numismatics/artificial-toning-screen",
  indicators: [
    { id: "abruptColorBands", label: "Abrupt color bands" },
    { id: "recessMismatch", label: "Color inconsistent in recesses" },
    { id: "heatExposure", label: "Known heat exposure" },
    { id: "chemicalResidue", label: "Chemical residue" },
  ],
  title: "Artificial Toning Screen",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
