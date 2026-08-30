import { createRiskScreen } from "../../core/operational.js";

const operation = createRiskScreen({
  description:
    "Summarize caller-observed indicators for electrolysis risk screen without treating the result as conclusive.",
  example: {
    unknownAlloy: true,
    unstableSurface: true,
    valuablePatina: false,
    noCurrentControl: false,
  },
  highRiskAt: 2,
  id: "numismatics/electrolysis-risk-screen",
  indicators: [
    { id: "unknownAlloy", label: "Unknown alloy" },
    { id: "unstableSurface", label: "Unstable or powdery surface" },
    { id: "valuablePatina", label: "Valuable original patina" },
    { id: "noCurrentControl", label: "No current or endpoint control" },
  ],
  title: "Electrolysis Risk Screen",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
