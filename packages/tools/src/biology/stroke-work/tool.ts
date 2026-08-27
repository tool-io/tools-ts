import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type StrokeWorkInput = {
  readonly strokeVolumeMl: number;
  readonly meanArterialMmhg: number;
  readonly meanAtrialMmhg: number;
};

export type StrokeWorkOutput = {
  readonly strokeWorkGramMeters: number;
};

export const strokeWorkExample = {
  input: { strokeVolumeMl: 70, meanArterialMmhg: 90, meanAtrialMmhg: 5 },
  output: { strokeWorkGramMeters: 85.67999999999999 },
} satisfies ToolExample<StrokeWorkInput, StrokeWorkOutput>;

export const strokeWorkTool = createSimpleTool({
  id: "biology/stroke-work",
  title: "Stroke Work Calculator",
  description:
    "Compute left ventricular stroke work from stroke volume and pressure gradient.",
  inputs: [
    {
      id: "strokeVolumeMl",
      kind: "number",
      label: "Stroke volume",
      minimum: Number.MIN_VALUE,
      unit: "mL",
    },
    {
      id: "meanArterialMmhg",
      kind: "number",
      label: "Mean arterial pressure",
      unit: "mmHg",
    },
    {
      id: "meanAtrialMmhg",
      kind: "number",
      label: "Mean atrial pressure",
      unit: "mmHg",
    },
  ],
  outputs: [
    {
      id: "strokeWorkGramMeters",
      kind: "number",
      label: "Stroke work",
      unit: "g·m",
    },
  ],
  calculate: (input) => ({
    strokeWorkGramMeters:
      (input.strokeVolumeMl as number) *
      ((input.meanArterialMmhg as number) - (input.meanAtrialMmhg as number)) *
      0.0144,
  }),
});
export const runStrokeWork = strokeWorkTool.execute;
export default strokeWorkTool;
