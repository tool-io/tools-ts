import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SolenoidInductanceInput = {
  readonly crossSectionAreaM2: number;
  readonly lengthMeters: number;
  readonly turnsInt: number;
};

export type SolenoidInductanceOutput = {
  readonly inductanceHenries: number;
};

const MU_0 = 1.25663706212e-6;

export const solenoidInductanceExample = {
  input: { crossSectionAreaM2: 0.001, lengthMeters: 0.1, turnsInt: 100 },
  output: { inductanceHenries: 0.000125663706212 },
} satisfies ToolExample<SolenoidInductanceInput, SolenoidInductanceOutput>;

export const calculateSolenoidInductance = (
  input: SolenoidInductanceInput,
): SolenoidInductanceOutput => {
  if (!(input.crossSectionAreaM2 > 0))
    simpleError("crossSectionAreaM2", "Area must be positive.", "invalid_area");
  if (!(input.lengthMeters > 0))
    simpleError("lengthMeters", "Length must be positive.", "invalid_length");
  return {
    inductanceHenries:
      (MU_0 * input.turnsInt ** 2 * input.crossSectionAreaM2) /
      input.lengthMeters,
  };
};

export const solenoidInductanceTool = createSimpleTool({
  calculate: (input) =>
    calculateSolenoidInductance(input as unknown as SolenoidInductanceInput),
  description:
    "Calculate air-core solenoid inductance from turns, area, and length.",
  id: "electronics/solenoid-inductance",
  inputs: [
    { id: "turnsInt", kind: "integer", label: "Turns", minimum: 1 },
    {
      id: "crossSectionAreaM2",
      kind: "number",
      label: "Cross-section area",
      unit: "m^2",
    },
    { id: "lengthMeters", kind: "number", label: "Length", unit: "m" },
  ],
  outputs: [
    {
      id: "inductanceHenries",
      kind: "number",
      label: "Inductance",
      unit: "H",
    },
  ],
  title: "Solenoid Inductance",
});
export const runSolenoidInductance = solenoidInductanceTool.execute;
export default solenoidInductanceTool;
