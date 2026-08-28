import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const boilingPointClausiusClapeyronTool = createSimpleTool({
  id: "chemistry/boiling-point-clausius-clapeyron",
  title: "Boiling Point Clausius-Clapeyron Calculator",
  description: "Solve for T2 from the Clausius-Clapeyron equation.",
  inputs: [
    { id: "pressure1", label: "P1", kind: "number", minimum: 0 },
    { id: "pressure2", label: "P2", kind: "number", minimum: 0 },
    { id: "temperature1K", label: "T1", kind: "number", minimum: 0 },
    { id: "deltaHVapCalMol", label: "dHvap", kind: "number" },
  ],
  outputs: [{ id: "boilingPointK", label: "Boiling point", kind: "number" }],
  calculate: (input) => {
    const p1 = input.pressure1 as number;
    const p2 = input.pressure2 as number;
    const t1 = input.temperature1K as number;
    const dh = input.deltaHVapCalMol as number;
    if (p1 <= 0 || p2 <= 0 || t1 <= 0 || dh <= 0)
      simpleError("pressure1", "All values must be positive.", "invalid_input");
    const lnRatio = Math.log(p2 / p1);
    const invT2 = 1 / t1 - (lnRatio * 1.987) / dh;
    if (!(invT2 > 0))
      simpleError(
        "pressure2",
        "The supplied values do not yield a positive absolute temperature.",
        "invalid_result",
      );
    return { boilingPointK: 1 / invT2 };
  },
});
export const runBoilingPointClausiusClapeyron =
  boilingPointClausiusClapeyronTool.execute;
export default boilingPointClausiusClapeyronTool;

export type BoilingPointClausiusClapeyronInput = {
  readonly pressure1: number;
  readonly pressure2: number;
  readonly temperature1K: number;
  readonly deltaHVapCalMol: number;
};

export type BoilingPointClausiusClapeyronOutput = {
  readonly boilingPointK: number;
};

export const boilingPointClausiusClapeyronExample = {
  input: {
    pressure1: 1,
    pressure2: 1,
    temperature1K: 1,
    deltaHVapCalMol: 1,
  },
  output: {
    boilingPointK: 1,
  },
} satisfies ToolExample<
  BoilingPointClausiusClapeyronInput,
  BoilingPointClausiusClapeyronOutput
>;
