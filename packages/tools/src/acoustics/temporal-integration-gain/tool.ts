import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TemporalIntegrationGainInput = Readonly<{
  readonly initialSeconds: number;
  readonly finalSeconds: number;
}>;
export type TemporalIntegrationGainOutput = Readonly<{
  readonly gainDecibels: number;
}>;

export const calculateTemporalIntegrationGain = (
  x: TemporalIntegrationGainInput,
): TemporalIntegrationGainOutput => {
  if (!Number.isFinite(x.initialSeconds) || x.initialSeconds <= 0)
    simpleError("initialSeconds", "Provide a finite positive number.");
  if (!Number.isFinite(x.finalSeconds) || x.finalSeconds <= 0)
    simpleError("finalSeconds", "Provide a finite positive number.");
  if (!(x.finalSeconds >= x.initialSeconds))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const gainDecibels = 10 * Math.log10(x.finalSeconds / x.initialSeconds);
  if (!Number.isFinite(gainDecibels))
    simpleError(
      "gainDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { gainDecibels: Object.is(gainDecibels, -0) ? 0 : gainDecibels };
};

export const example = {
  input: {
    initialSeconds: 1,
    finalSeconds: 2,
  },
  output: { gainDecibels: 3.010299956639812 },
} satisfies ToolExample<
  TemporalIntegrationGainInput,
  TemporalIntegrationGainOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/temporal-integration-gain",
  title: "Temporal Integration Gain",
  description:
    "Ideal energy-integration gain in dB from increasing coherent observation duration; excludes auditory saturation.",
  inputs: [
    {
      id: "initialSeconds",
      kind: "number",
      label: "Initial Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "finalSeconds",
      kind: "number",
      label: "Final Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "gainDecibels", kind: "number", label: "Gain Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateTemporalIntegrationGain({
      initialSeconds: input.initialSeconds as number,
      finalSeconds: input.finalSeconds as number,
    }),
});
export const temporalIntegrationGainTool = tool;
export const runTemporalIntegrationGain = tool.execute;
export default tool;
