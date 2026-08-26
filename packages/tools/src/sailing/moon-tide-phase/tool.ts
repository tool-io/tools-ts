import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MoonTidePhaseInput = {
  lunarAgeDays: number;
};

export type MoonTidePhaseOutput = {
  springNeapFactor: number;
};

export const moonTidePhaseExample = {
  input: { lunarAgeDays: 0 },
  output: { springNeapFactor: 1 },
} satisfies ToolExample<MoonTidePhaseInput, MoonTidePhaseOutput>;

export const moonTidePhaseTool = createSimpleTool({
  calculate: (input) => ({
    springNeapFactor: Math.abs(
      Math.cos(((2 * Math.PI) / 29.53) * (input.lunarAgeDays as number)),
    ),
  }),
  description:
    "Compute the spring/neap modulation factor from factor = abs(cos(2 * PI * lunarAgeDays / 29.53)); one means spring tides and zero means neap tides.",
  id: "sailing/moon-tide-phase",
  inputs: [
    {
      description: "Age of the moon in days since new moon, 0 to 29.53.",
      id: "lunarAgeDays",
      kind: "number",
      label: "Lunar age",
      maximum: 29.53,
      minimum: 0,
      unit: "d",
    },
  ],
  outputs: [
    {
      description: "Spring/neap factor between zero (neap) and one (spring).",
      id: "springNeapFactor",
      kind: "number",
      label: "Spring/neap factor",
    },
  ],
  title: "Spring Neap Factor Calculator",
});
export const runMoonTidePhase = moonTidePhaseTool.execute;
export default moonTidePhaseTool;
