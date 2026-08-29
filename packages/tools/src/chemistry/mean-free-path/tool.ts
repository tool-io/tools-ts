import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const meanFreePathTool = createSimpleTool({
  id: "chemistry/mean-free-path",
  title: "Mean Free Path Calculator",
  description: "Compute mean free path lambda = kT/(sqrt(2)*pi*d^2*P).",
  inputs: [
    {
      id: "temperatureK",
      label: "Temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
    {
      id: "pressurePa",
      label: "Pressure",
      kind: "number",
      minimum: 0,
      unit: "Pa",
    },
    {
      id: "collisionDiameterNM",
      label: "Collision diameter",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    { id: "meanFreePathM", label: "Mean free path", kind: "number", unit: "m" },
  ],
  calculate: (input) => {
    const temperatureK = input.temperatureK as number;
    const pressurePa = input.pressurePa as number;
    const collisionDiameterM = (input.collisionDiameterNM as number) * 1e-9;
    if (!(temperatureK > 0))
      simpleError("temperatureK", "Temperature must be greater than zero.");
    if (!(pressurePa > 0))
      simpleError("pressurePa", "Pressure must be greater than zero.");
    if (!(collisionDiameterM > 0))
      simpleError(
        "collisionDiameterNM",
        "Collision diameter must be greater than zero.",
      );
    const boltzmannConstant = 1.380649e-23;
    return {
      meanFreePathM:
        (boltzmannConstant * temperatureK) /
        (Math.SQRT2 * Math.PI * collisionDiameterM ** 2 * pressurePa),
    };
  },
});
export default meanFreePathTool;
export const runMeanFreePath = meanFreePathTool.execute;

export type MeanFreePathInput = {
  readonly temperatureK: number;
  readonly pressurePa: number;
  readonly collisionDiameterNM: number;
};

export type MeanFreePathOutput = {
  readonly meanFreePathM: number;
};

export const meanFreePathExample = {
  input: {
    temperatureK: 1,
    pressurePa: 1,
    collisionDiameterNM: 1,
  },
  output: {
    meanFreePathM: 0.0000031075520539649807,
  },
} satisfies ToolExample<MeanFreePathInput, MeanFreePathOutput>;
