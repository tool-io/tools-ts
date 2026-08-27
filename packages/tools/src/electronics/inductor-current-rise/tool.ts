import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InductorCurrentRiseInput = {
  readonly inductanceH: number;
  readonly resistanceOhms: number;
  readonly supplyVolts: number;
  readonly timeSeconds: number;
};

export type InductorCurrentRiseOutput = {
  readonly inductorCurrentA: number;
};

export const inductorCurrentRiseExample = {
  input: {
    inductanceH: 0.1,
    resistanceOhms: 5,
    supplyVolts: 10,
    timeSeconds: 0.02,
  },
  output: { inductorCurrentA: 1.2642411176571153 },
} satisfies ToolExample<InductorCurrentRiseInput, InductorCurrentRiseOutput>;

export const inductorCurrentRiseTool = createSimpleTool({
  calculate: (input) => {
    const { inductanceH, resistanceOhms, supplyVolts, timeSeconds } =
      input as unknown as InductorCurrentRiseInput;
    if (resistanceOhms <= 0)
      simpleError(
        "resistanceOhms",
        "Resistance must be positive.",
        "degenerate_input",
      );
    if (inductanceH <= 0)
      simpleError(
        "inductanceH",
        "Inductance must be positive.",
        "degenerate_input",
      );
    if (timeSeconds < 0)
      simpleError(
        "timeSeconds",
        "Time cannot be negative.",
        "degenerate_input",
      );
    return {
      inductorCurrentA:
        (supplyVolts / resistanceOhms) *
        (1 - Math.exp((-timeSeconds * resistanceOhms) / inductanceH)),
    };
  },
  description:
    "Compute the RL circuit current as it rises toward its steady-state value.",
  id: "electronics/inductor-current-rise",
  inputs: [
    { id: "supplyVolts", kind: "number", label: "Supply voltage", unit: "V" },
    { id: "resistanceOhms", kind: "number", label: "Resistance", unit: "ohm" },
    { id: "inductanceH", kind: "number", label: "Inductance", unit: "H" },
    { id: "timeSeconds", kind: "number", label: "Time", unit: "s" },
  ],
  outputs: [
    {
      id: "inductorCurrentA",
      kind: "number",
      label: "Inductor current",
      unit: "A",
    },
  ],
  title: "RL Current Rise",
});
export const runInductorCurrentRise = inductorCurrentRiseTool.execute;
export default inductorCurrentRiseTool;
