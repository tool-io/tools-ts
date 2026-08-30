import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JfetOutputResistanceInput = Readonly<{
  readonly outputConductanceSiemens: number;
}>;
export type JfetOutputResistanceOutput = Readonly<{
  readonly outputOhms: number;
}>;

export const calculateJfetOutputResistance = (
  x: JfetOutputResistanceInput,
): JfetOutputResistanceOutput => {
  if (
    !Number.isFinite(x.outputConductanceSiemens) ||
    x.outputConductanceSiemens < 0
  )
    simpleError(
      "outputConductanceSiemens",
      "Provide a finite number at least 0.",
    );
  const outputOhms = 1 / x.outputConductanceSiemens;
  if (!Number.isFinite(outputOhms))
    simpleError(
      "outputOhms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { outputOhms: Object.is(outputOhms, -0) ? 0 : outputOhms };
};

export const example = {
  input: { outputConductanceSiemens: 0.001 },
  output: { outputOhms: 1000 },
} satisfies ToolExample<JfetOutputResistanceInput, JfetOutputResistanceOutput>;

export const tool = createSimpleTool({
  id: "semiconductor/jfet-output-resistance",
  title: "JFET Output Resistance",
  description:
    "Small-signal JFET output resistance as the reciprocal of measured drain-output conductance at one bias point.",
  inputs: [
    {
      id: "outputConductanceSiemens",
      kind: "number",
      label: "Output Conductance Siemens",
      unit: "S",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "outputOhms", kind: "number", label: "Output Ohms", unit: "Ω" },
  ],
  calculate: (input) =>
    calculateJfetOutputResistance({
      outputConductanceSiemens: input.outputConductanceSiemens as number,
    }),
});
export const jfetOutputResistanceTool = tool;
export const runJfetOutputResistance = tool.execute;
export default tool;
