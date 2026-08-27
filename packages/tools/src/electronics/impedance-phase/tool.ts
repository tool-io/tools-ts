import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const impedancePhaseExample = {
  input: { reactanceOhms: 8, resistanceOhms: 8 },
} satisfies ToolExample<{
  readonly reactanceOhms: number;
  readonly resistanceOhms: number;
}>;

export const impedancePhaseTool = createSimpleTool({
  id: "electronics/impedance-phase",
  title: "Impedance Phase",
  description:
    "Calculate the phase angle of an impedance from reactance and resistance in degrees.",
  inputs: [
    { id: "reactanceOhms", label: "Reactance", kind: "number", unit: "ohm" },
    { id: "resistanceOhms", label: "Resistance", kind: "number", unit: "ohm" },
  ],
  outputs: [
    {
      id: "phaseDegrees",
      label: "Phase angle",
      kind: "number",
      unit: "deg",
    },
  ],
  calculate: (input) => {
    const resistanceOhms = input.resistanceOhms as number;
    if (resistanceOhms <= 0)
      simpleError("resistanceOhms", "Resistance must be positive.");
    return {
      phaseDegrees:
        (Math.atan((input.reactanceOhms as number) / resistanceOhms) * 180) /
        Math.PI,
    };
  },
});
export const runImpedancePhase = impedancePhaseTool.execute;
export default impedancePhaseTool;
