import { createRiskScreen } from "../../core/operational.js";

const operation = createRiskScreen({
  description:
    "Summarize caller-observed indicators for toning environment screen without treating the result as conclusive.",
  example: {
    sulfurExposure: true,
    highHumidity: true,
    reactiveHolder: false,
    temperatureCycling: false,
  },
  highRiskAt: 2,
  id: "numismatics/toning-environment-screen",
  indicators: [
    { id: "sulfurExposure", label: "Sulfur-bearing storage" },
    { id: "highHumidity", label: "High humidity" },
    { id: "reactiveHolder", label: "Reactive holder material" },
    { id: "temperatureCycling", label: "Temperature cycling" },
  ],
  title: "Toning Environment Screen",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
