import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const vaporPressureClausiusClapeyronTool = createSimpleTool({
  id: "chemistry/vapor-pressure-clausius-clapeyron",
  title: "Vapor Pressure Clausius-Clapeyron Calculator",
  description: "Compute P2 = P1 * exp[-dHvap/R * (1/T2 - 1/T1)].",
  inputs: [
    { id: "pressure1", label: "P1", kind: "number", minimum: 0 },
    { id: "temperature1K", label: "T1", kind: "number", minimum: 0 },
    { id: "temperature2K", label: "T2", kind: "number", minimum: 0 },
    { id: "deltaHVapCalMol", label: "dHvap", kind: "number" },
  ],
  outputs: [{ id: "pressure2", label: "P2", kind: "number" }],
  calculate: (input) => {
    const t1 = input.temperature1K as number;
    const t2 = input.temperature2K as number;
    if (t1 <= 0 || t2 <= 0)
      simpleError("temperature1K", "Temps must be > 0 K.", "invalid_temp");
    if (!((input.pressure1 as number) > 0))
      simpleError("pressure1", "Initial pressure must be greater than zero.");
    return {
      pressure2:
        (input.pressure1 as number) *
        Math.exp(
          -((input.deltaHVapCalMol as number) / 1.987) * (1 / t2 - 1 / t1),
        ),
    };
  },
});
export const runVaporPressureClausiusClapeyron =
  vaporPressureClausiusClapeyronTool.execute;
export default vaporPressureClausiusClapeyronTool;

export type VaporPressureClausiusClapeyronInput = {
  readonly pressure1: number;
  readonly temperature1K: number;
  readonly temperature2K: number;
  readonly deltaHVapCalMol: number;
};

export type VaporPressureClausiusClapeyronOutput = {
  readonly pressure2: number;
};

export const vaporPressureClausiusClapeyronExample = {
  input: {
    pressure1: 1,
    temperature1K: 1,
    temperature2K: 1,
    deltaHVapCalMol: 1,
  },
  output: {
    pressure2: 1,
  },
} satisfies ToolExample<
  VaporPressureClausiusClapeyronInput,
  VaporPressureClausiusClapeyronOutput
>;
