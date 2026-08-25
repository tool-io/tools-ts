import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const cardiacOutputExample = {
  input: { heartRateBpm: 70, strokeVolumeMl: 70 },
  output: { cardiacOutputLPerMin: 4.9 },
} satisfies ToolExample<
  { readonly heartRateBpm: number; readonly strokeVolumeMl: number },
  { readonly cardiacOutputLPerMin: number }
>;

export const cardiacOutputTool = createSimpleTool({
  id: "biology/cardiac-output",
  title: "Cardiac Output L/min",
  description: "Compute cardiac output from heart rate and stroke volume.",
  inputs: [
    {
      id: "heartRateBpm",
      kind: "number",
      label: "Heart rate",
      minimum: Number.MIN_VALUE,
      unit: "bpm",
    },
    {
      id: "strokeVolumeMl",
      kind: "number",
      label: "Stroke volume",
      minimum: Number.MIN_VALUE,
      unit: "mL",
    },
  ],
  outputs: [
    {
      id: "cardiacOutputLPerMin",
      kind: "number",
      label: "Cardiac output",
      unit: "L/min",
    },
  ],
  calculate: (input) => ({
    cardiacOutputLPerMin:
      ((input.heartRateBpm as number) * (input.strokeVolumeMl as number)) /
      1000,
  }),
});
export const runCardiacOutput = cardiacOutputTool.execute;
export default cardiacOutputTool;
