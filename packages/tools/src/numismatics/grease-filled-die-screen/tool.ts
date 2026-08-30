import { createRiskScreen } from "../../core/operational.js";

const operation = createRiskScreen({
  description:
    "Summarize caller-observed indicators for grease-filled die screen without treating the result as conclusive.",
  example: {
    weakDesign: true,
    normalRim: true,
    localizedLoss: false,
    noAbrasion: false,
  },
  highRiskAt: 2,
  id: "numismatics/grease-filled-die-screen",
  indicators: [
    { id: "weakDesign", label: "Weak or missing design" },
    { id: "normalRim", label: "Normal surrounding rim" },
    { id: "localizedLoss", label: "Localized feature loss" },
    { id: "noAbrasion", label: "No abrasion across the loss" },
  ],
  title: "Grease-Filled Die Screen",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
