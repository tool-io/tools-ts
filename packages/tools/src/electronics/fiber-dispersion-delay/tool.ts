import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FiberDispersionDelayInput = {
  readonly dispersionPsNmkM: number;
  readonly lengthKm: number;
  readonly linewidthNm: number;
};

export type FiberDispersionDelayOutput = {
  readonly pulseSpreadNs: number;
};

export const fiberDispersionDelayExample = {
  input: { dispersionPsNmkM: 17, lengthKm: 40, linewidthNm: 0.5 },
  output: { pulseSpreadNs: 0.34 },
} satisfies ToolExample<FiberDispersionDelayInput, FiberDispersionDelayOutput>;

export const calculateFiberDispersionDelay = (
  input: FiberDispersionDelayInput,
): FiberDispersionDelayOutput => {
  if (!(input.dispersionPsNmkM >= 0))
    simpleError(
      "dispersionPsNmkM",
      "Chromatic dispersion must not be negative.",
      "invalid_dispersion",
    );
  if (!(input.lengthKm > 0))
    simpleError("lengthKm", "Fiber length must be positive.", "invalid_length");
  if (!(input.linewidthNm > 0))
    simpleError(
      "linewidthNm",
      "Source linewidth must be positive.",
      "invalid_linewidth",
    );
  return {
    pulseSpreadNs:
      (input.dispersionPsNmkM * input.lengthKm * input.linewidthNm) / 1000,
  };
};

export const fiberDispersionDelayTool = createSimpleTool({
  calculate: (input) =>
    calculateFiberDispersionDelay(
      input as unknown as FiberDispersionDelayInput,
    ),
  description:
    "Compute the chromatic-dispersion pulse spread of an optical fiber link.",
  id: "electronics/fiber-dispersion-delay",
  inputs: [
    {
      description: "Chromatic dispersion coefficient.",
      format: "dispersion",
      id: "dispersionPsNmkM",
      kind: "number",
      label: "Dispersion coefficient",
      unit: "ps/(nm·km)",
    },
    {
      description: "Total length of the fiber run.",
      format: "length",
      id: "lengthKm",
      kind: "number",
      label: "Fiber length",
      unit: "km",
    },
    {
      description: "RMS spectral width of the light source.",
      format: "length",
      id: "linewidthNm",
      kind: "number",
      label: "Source linewidth",
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Pulse spread caused by chromatic dispersion.",
      format: "time",
      id: "pulseSpreadNs",
      kind: "number",
      label: "Pulse spread",
      unit: "ns",
    },
  ],
  title: "Dispersion Delay",
});
export const runFiberDispersionDelay = fiberDispersionDelayTool.execute;
export default fiberDispersionDelayTool;
