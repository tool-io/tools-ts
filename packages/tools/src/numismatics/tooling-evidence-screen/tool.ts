import { createRiskScreen } from "../../core/operational.js";

const operation = createRiskScreen({
  description:
    "Summarize caller-observed indicators for tooling evidence screen without treating the result as conclusive.",
  example: {
    engravedLines: true,
    missingFlowTexture: true,
    recontouredDevices: false,
    metalDisplacement: false,
  },
  highRiskAt: 2,
  id: "numismatics/tooling-evidence-screen",
  indicators: [
    { id: "engravedLines", label: "Engraved or chased lines" },
    { id: "missingFlowTexture", label: "Missing flow texture" },
    { id: "recontouredDevices", label: "Recontoured devices" },
    { id: "metalDisplacement", label: "Visible metal displacement" },
  ],
  title: "Tooling Evidence Screen",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
