import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PsychrophileMaxtempBelow20CheckerInput = {
  readonly maxGrowthTempC: number;
};

export type PsychrophileMaxtempBelow20CheckerOutput = {
  readonly maximumAtOrBelow20C: boolean;
};

export const psychrophileMaxtempBelow20CheckerExample = {
  input: { maxGrowthTempC: 17 },
  output: { maximumAtOrBelow20C: true },
} satisfies ToolExample<
  PsychrophileMaxtempBelow20CheckerInput,
  PsychrophileMaxtempBelow20CheckerOutput
>;

export const psychrophileMaxtempBelow20CheckerTool = createSimpleTool({
  id: "mycology/psychrophile-maxtemp-below20-checker",
  title: "Psychrophile Checker",
  description:
    "Check whether the reported maximum growth temperature is at or below 20 °C; maximum temperature alone cannot distinguish psychrophiles from psychrotolerant organisms.",
  inputs: [
    {
      id: "maxGrowthTempC",
      kind: "number",
      label: "Maximum growth temperature",
      minimum: -273.15,
      unit: "°C",
    },
  ],
  outputs: [
    {
      id: "maximumAtOrBelow20C",
      kind: "boolean",
      label: "Maximum at or below 20 °C",
    },
  ],
  calculate: (input) => {
    const maxGrowthTempC = input.maxGrowthTempC as number;
    return { maximumAtOrBelow20C: maxGrowthTempC <= 20 };
  },
});
export const runPsychrophileMaxtempBelow20Checker =
  psychrophileMaxtempBelow20CheckerTool.execute;
export default psychrophileMaxtempBelow20CheckerTool;
