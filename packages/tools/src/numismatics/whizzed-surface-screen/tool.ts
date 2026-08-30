import { createRiskScreen } from "../../core/operational.js";

const operation = createRiskScreen({
  description:
    "Summarize caller-observed indicators for whizzed surface screen without treating the result as conclusive.",
  example: {
    parallelHairlines: true,
    deviceBuildup: true,
    unnaturalLuster: false,
    flattenedTexture: false,
  },
  highRiskAt: 2,
  id: "numismatics/whizzed-surface-screen",
  indicators: [
    { id: "parallelHairlines", label: "Parallel rotary hairlines" },
    { id: "deviceBuildup", label: "Metal buildup near devices" },
    { id: "unnaturalLuster", label: "Unnatural rotating luster" },
    { id: "flattenedTexture", label: "Flattened surface texture" },
  ],
  title: "Whizzed Surface Screen",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
