import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly electricalInputWatts: number;
  readonly opticalOutputWatts: number;
  readonly cooledFootprintSquareMeters: number;
}>;
export type Output = Readonly<{
  readonly wasteHeatWatts: number;
  readonly heatFluxWattsPerSquareMeter: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.cooledFootprintSquareMeters <= 0)
    simpleError(
      "cooledFootprintSquareMeters",
      "Cooled footprint must be positive.",
      "invalid_area",
    );
  const wasteHeatWatts = input.electricalInputWatts - input.opticalOutputWatts;
  return {
    wasteHeatWatts,
    heatFluxWattsPerSquareMeter:
      wasteHeatWatts / input.cooledFootprintSquareMeters,
  };
};

export const exampleInput = {
  electricalInputWatts: 100,
  opticalOutputWatts: 20,
  cooledFootprintSquareMeters: 0.01,
} satisfies Input;
export const exampleOutput = {
  wasteHeatWatts: 80,
  heatFluxWattsPerSquareMeter: 8000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      electricalInputWatts: input.electricalInputWatts as number,
      opticalOutputWatts: input.opticalOutputWatts as number,
      cooledFootprintSquareMeters: input.cooledFootprintSquareMeters as number,
    }),
  description:
    "Calculate diode-stack waste heat and cooled-footprint heat flux.",
  id: "laser/diode-stack-heat-flux",
  inputs: [
    {
      id: "electricalInputWatts",
      label: "Electrical input power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "opticalOutputWatts",
      label: "Optical output power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "cooledFootprintSquareMeters",
      label: "Cooled footprint",
      kind: "number",
      minimum: 0,
      unit: "m²",
    },
  ],
  outputs: [
    { id: "wasteHeatWatts", label: "Waste heat", kind: "number", unit: "W" },
    {
      id: "heatFluxWattsPerSquareMeter",
      label: "Heat flux",
      kind: "number",
      unit: "W/m²",
    },
  ],
  title: "Diode-Stack Heat Flux",
});

export const run = tool.execute;
export default tool;
