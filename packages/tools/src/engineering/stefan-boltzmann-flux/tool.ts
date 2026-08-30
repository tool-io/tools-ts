import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StefanBoltzmannFluxInput = Readonly<{
  readonly emissivity: number;
  readonly temperatureKelvin: number;
}>;
export type StefanBoltzmannFluxOutput = Readonly<{
  readonly fluxWattsPerSquareMeter: number;
}>;

export const calculateStefanBoltzmannFlux = (
  x: StefanBoltzmannFluxInput,
): StefanBoltzmannFluxOutput => {
  if (!Number.isFinite(x.emissivity) || x.emissivity < 0)
    simpleError("emissivity", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.temperatureKelvin) || x.temperatureKelvin < 0)
    simpleError("temperatureKelvin", "Provide a finite number at least 0.");
  if (x.emissivity > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const fluxWattsPerSquareMeter =
    x.emissivity * 5.670374419e-8 * x.temperatureKelvin ** 4;
  if (!Number.isFinite(fluxWattsPerSquareMeter))
    simpleError(
      "fluxWattsPerSquareMeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    fluxWattsPerSquareMeter: Object.is(fluxWattsPerSquareMeter, -0)
      ? 0
      : fluxWattsPerSquareMeter,
  };
};

export const example = {
  input: { emissivity: 0.8, temperatureKelvin: 300 },
  output: { fluxWattsPerSquareMeter: 367.44026235120003 },
} satisfies ToolExample<StefanBoltzmannFluxInput, StefanBoltzmannFluxOutput>;

export const tool = createSimpleTool({
  id: "engineering/stefan-boltzmann-flux",
  title: "Stefan Boltzmann Flux",
  description:
    "Radiant exitance εσT⁴ emitted by a gray surface at absolute temperature; excludes background radiation.",
  inputs: [
    { id: "emissivity", kind: "number", label: "Emissivity", minimum: 0 },
    {
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature Kelvin",
      unit: "K",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "fluxWattsPerSquareMeter",
      kind: "number",
      label: "Flux Watts Per Square Meter",
      unit: "W/m²",
    },
  ],
  calculate: (input) =>
    calculateStefanBoltzmannFlux({
      emissivity: input.emissivity as number,
      temperatureKelvin: input.temperatureKelvin as number,
    }),
});
export const stefanBoltzmannFluxTool = tool;
export const runStefanBoltzmannFlux = tool.execute;
export default tool;
