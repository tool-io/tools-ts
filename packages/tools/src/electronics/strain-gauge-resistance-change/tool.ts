import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { gaugeFactor: 2, strain: 0.001, initialResistanceOhm: 120 },
  output: { resistanceChangeOhm: 0.24, finalResistanceOhm: 120.24 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/strain-gauge-resistance-change",
  title: "Strain Gauge Resistance Change",
  description:
    "Compute ΔR=GF·ε·R₀ from gauge factor, dimensionless strain, and initial resistance. This linear approximation applies to small strain and does not include temperature compensation.",
  inputs: [
    { id: "gaugeFactor", kind: "number", label: "Gauge factor" },
    { id: "strain", kind: "number", label: "Strain" },
    {
      id: "initialResistanceOhm",
      kind: "number",
      label: "Initial resistance (Ω)",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "resistanceChangeOhm",
      kind: "number",
      label: "Resistance Change ohm",
    },
    { id: "finalResistanceOhm", kind: "number", label: "Final Resistance ohm" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      resistanceChangeOhm: i.gaugeFactor * i.strain * i.initialResistanceOhm,
      finalResistanceOhm:
        i.initialResistanceOhm * (1 + i.gaugeFactor * i.strain),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type StrainGaugeResistanceChangeInput = Readonly<typeof example.input>;
export type StrainGaugeResistanceChangeOutput = Readonly<typeof example.output>;
export const strainGaugeResistanceChangeTool = tool;
export const runStrainGaugeResistanceChange = tool.execute;
export default tool;
