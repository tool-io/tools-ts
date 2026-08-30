import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FiberAttenuationInput = Readonly<{
  readonly attenuationDecibelsPerKilometer: number;
  readonly lengthKilometers: number;
}>;
export type FiberAttenuationOutput = Readonly<{
  readonly lossDecibels: number;
}>;

export const calculateFiberAttenuation = (
  x: FiberAttenuationInput,
): FiberAttenuationOutput => {
  if (
    !Number.isFinite(x.attenuationDecibelsPerKilometer) ||
    x.attenuationDecibelsPerKilometer < 0
  )
    simpleError(
      "attenuationDecibelsPerKilometer",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.lengthKilometers) || x.lengthKilometers < 0)
    simpleError("lengthKilometers", "Provide a finite number at least 0.");
  const lossDecibels = x.attenuationDecibelsPerKilometer * x.lengthKilometers;
  if (!Number.isFinite(lossDecibels))
    simpleError(
      "lossDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { lossDecibels: Object.is(lossDecibels, -0) ? 0 : lossDecibels };
};

export const example = {
  input: { attenuationDecibelsPerKilometer: 0.2, lengthKilometers: 10 },
  output: { lossDecibels: 2 },
} satisfies ToolExample<FiberAttenuationInput, FiberAttenuationOutput>;

export const tool = createSimpleTool({
  id: "engineering/fiber-attenuation",
  title: "Fiber Attenuation",
  description:
    "Optical fiber power loss in decibels from attenuation per kilometer times fiber length; excludes connectors and splices.",
  inputs: [
    {
      id: "attenuationDecibelsPerKilometer",
      kind: "number",
      label: "Attenuation Decibels Per Kilometer",
      unit: "dB/km",
      minimum: 0,
    },
    {
      id: "lengthKilometers",
      kind: "number",
      label: "Length Kilometers",
      unit: "km",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "lossDecibels", kind: "number", label: "Loss Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateFiberAttenuation({
      attenuationDecibelsPerKilometer:
        input.attenuationDecibelsPerKilometer as number,
      lengthKilometers: input.lengthKilometers as number,
    }),
});
export const fiberAttenuationTool = tool;
export const runFiberAttenuation = tool.execute;
export default tool;
