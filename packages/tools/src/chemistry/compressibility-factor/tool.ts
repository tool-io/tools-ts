import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const compressibilityFactorTool = createSimpleTool({
  id: "chemistry/compressibility-factor",
  title: "Compressibility Factor Calculator",
  description:
    "Compute Z = PV/(nRT) to quantify deviation of a real gas from ideal behavior.",
  inputs: [
    {
      description: "Observed pressure.",
      id: "pressureAtm",
      label: "Pressure",
      kind: "number",
      minimum: 0,
      unit: "atm",
    },
    {
      description: "Container volume.",
      id: "volumeL",
      label: "Volume",
      kind: "number",
      minimum: 0,
      unit: "L",
    },
    {
      description: "Moles of gas; must be greater than zero.",
      id: "moles",
      label: "Moles",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      description: "Absolute temperature.",
      id: "temperatureK",
      label: "Temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
  ],
  outputs: [
    {
      description: "Compressibility factor; one means ideal behavior.",
      id: "z",
      label: "Z factor",
      kind: "number",
    },
  ],
  calculate: (input) => {
    if (!((input.pressureAtm as number) > 0))
      simpleError(
        "pressureAtm",
        "Pressure must be greater than zero.",
        "invalid_pressure",
      );
    if (!((input.volumeL as number) > 0))
      simpleError(
        "volumeL",
        "Volume must be greater than zero.",
        "invalid_volume",
      );
    if (!((input.moles as number) > 0))
      simpleError(
        "moles",
        "Amount must be greater than zero.",
        "invalid_amount",
      );
    if (!((input.temperatureK as number) > 0))
      simpleError(
        "temperatureK",
        "Temperature must be greater than zero.",
        "invalid_temperature",
      );
    const R = 0.08206;
    const denominator =
      (input.moles as number) * R * (input.temperatureK as number);
    return {
      z:
        ((input.pressureAtm as number) * (input.volumeL as number)) /
        denominator,
    };
  },
});
export const runCompressibilityFactor = compressibilityFactorTool.execute;
export default compressibilityFactorTool;

export type CompressibilityFactorInput = {
  readonly pressureAtm: number;
  readonly volumeL: number;
  readonly moles: number;
  readonly temperatureK: number;
};

export type CompressibilityFactorOutput = {
  readonly z: number;
};

export const compressibilityFactorExample = {
  input: {
    pressureAtm: 1,
    volumeL: 1,
    moles: 1,
    temperatureK: 1,
  },
  output: {
    z: 12.186205215695834,
  },
} satisfies ToolExample<
  CompressibilityFactorInput,
  CompressibilityFactorOutput
>;
