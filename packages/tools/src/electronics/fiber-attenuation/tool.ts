import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FiberAttenuationInput = {
  readonly attenuationDbPerKm: number;
  readonly lengthKm: number;
};

export type FiberAttenuationOutput = {
  readonly totalAttenuationDb: number;
};

export const fiberAttenuationExample = {
  input: { attenuationDbPerKm: 0.35, lengthKm: 12 },
  output: { totalAttenuationDb: 4.199999999999999 },
} satisfies ToolExample<FiberAttenuationInput, FiberAttenuationOutput>;

export const calculateFiberAttenuation = (
  input: FiberAttenuationInput,
): FiberAttenuationOutput => {
  if (!(input.attenuationDbPerKm >= 0))
    simpleError(
      "attenuationDbPerKm",
      "Attenuation coefficient must not be negative.",
      "invalid_attenuation",
    );
  if (!(input.lengthKm >= 0))
    simpleError(
      "lengthKm",
      "Fiber length must not be negative.",
      "invalid_length",
    );
  return { totalAttenuationDb: input.attenuationDbPerKm * input.lengthKm };
};

export const fiberAttenuationTool = createSimpleTool({
  calculate: (input) =>
    calculateFiberAttenuation(input as unknown as FiberAttenuationInput),
  description:
    "Compute the total attenuation of an optical fiber link from its loss coefficient and length.",
  id: "electronics/fiber-attenuation",
  inputs: [
    {
      description: "Loss per kilometer of fiber.",
      format: "attenuation",
      id: "attenuationDbPerKm",
      kind: "number",
      label: "Attenuation coefficient",
      unit: "dB/km",
    },
    {
      description: "Total length of the fiber run.",
      format: "length",
      id: "lengthKm",
      kind: "number",
      label: "Fiber length",
      unit: "km",
    },
  ],
  outputs: [
    {
      description: "Total link loss.",
      format: "attenuation",
      id: "totalAttenuationDb",
      kind: "number",
      label: "Total attenuation",
      unit: "dB",
    },
  ],
  title: "Fiber Attenuation dB",
});
export const runFiberAttenuation = fiberAttenuationTool.execute;
export default fiberAttenuationTool;
