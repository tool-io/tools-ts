import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LnaGainFlatnessInput = Readonly<{
  readonly maxGainDb: number;
  readonly minGainDb: number;
}>;
export type LnaGainFlatnessOutput = Readonly<{
  readonly flatnessDb: number;
}>;

export const calculateLnaGainFlatness = (
  x: LnaGainFlatnessInput,
): LnaGainFlatnessOutput => {
  if (!Number.isFinite(x.maxGainDb))
    simpleError("maxGainDb", "Provide a finite number.");
  if (!Number.isFinite(x.minGainDb))
    simpleError("minGainDb", "Provide a finite number.");
  if (x.maxGainDb < x.minGainDb)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const flatnessDb = x.maxGainDb - x.minGainDb;
  if (!Number.isFinite(flatnessDb))
    simpleError(
      "flatnessDb",
      "Inputs produce an undefined or non-finite result.",
    );
  return { flatnessDb: Object.is(flatnessDb, -0) ? 0 : flatnessDb };
};

export const example = {
  input: { maxGainDb: 21, minGainDb: 19 },
  output: { flatnessDb: 2 },
} satisfies ToolExample<LnaGainFlatnessInput, LnaGainFlatnessOutput>;

export const tool = createSimpleTool({
  id: "electronics/lna-gain-flatness",
  title: "LNA Gain Flatness",
  description:
    "Peak-to-peak LNA gain ripple across a measured passband using the maximum and minimum observed gain.",
  inputs: [
    { id: "maxGainDb", kind: "number", label: "Max Gain Db", unit: "dB" },
    { id: "minGainDb", kind: "number", label: "Min Gain Db", unit: "dB" },
  ],
  outputs: [
    { id: "flatnessDb", kind: "number", label: "Flatness Db", unit: "dB" },
  ],
  calculate: (input) =>
    calculateLnaGainFlatness({
      maxGainDb: input.maxGainDb as number,
      minGainDb: input.minGainDb as number,
    }),
});
export const lnaGainFlatnessTool = tool;
export const runLnaGainFlatness = tool.execute;
export default tool;
