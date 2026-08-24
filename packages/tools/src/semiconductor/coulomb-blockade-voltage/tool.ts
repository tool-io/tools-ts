import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const E_OVER_TWO_C_MILLIVOLT_FEMTOFARAD = 80.108832;

export type CoulombBlockadeVoltageInput = {
  readonly totalCapacitanceFemtoFarads: number;
};

export type CoulombBlockadeVoltageOutput = {
  readonly blockadeMillivolts: number;
};

export const coulombBlockadeVoltageExample = {
  input: { totalCapacitanceFemtoFarads: 1 },
  output: { blockadeMillivolts: 80.108832 },
} satisfies ToolExample<
  CoulombBlockadeVoltageInput,
  CoulombBlockadeVoltageOutput
>;

export const calculateCoulombBlockadeVoltage = (
  input: CoulombBlockadeVoltageInput,
): CoulombBlockadeVoltageOutput => {
  const totalCapacitanceFemtoFarads = input.totalCapacitanceFemtoFarads;
  if (
    !Number.isFinite(totalCapacitanceFemtoFarads) ||
    totalCapacitanceFemtoFarads <= 0
  )
    simpleError(
      "totalCapacitanceFemtoFarads",
      "Total capacitance must be a finite positive number.",
      "invalid_value",
    );

  const blockadeMillivolts =
    E_OVER_TWO_C_MILLIVOLT_FEMTOFARAD / totalCapacitanceFemtoFarads;
  if (!Number.isFinite(blockadeMillivolts))
    simpleError(
      "totalCapacitanceFemtoFarads",
      "Blockade voltage overflowed.",
      "numeric_overflow",
    );

  return {
    blockadeMillivolts: blockadeMillivolts === 0 ? 0 : blockadeMillivolts,
  };
};

export const coulombBlockadeVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculateCoulombBlockadeVoltage({
      totalCapacitanceFemtoFarads: input.totalCapacitanceFemtoFarads as number,
    }),
  description:
    "Compute the Coulomb-blockade voltage e over twice the total capacitance of an island. Formula: Vb [mV] = 80.108832 / C [fF] (since e/(2·C) with e=1.602176634e-19 C, 1 fF=1e-15 F, converted to mV). Input: C > 0 fF. Output: Vb > 0 mV. Assumes an isolated metallic island at zero temperature and that C is the total capacitance to all surroundings.",
  id: "semiconductor/coulomb-blockade-voltage",
  inputs: [
    {
      description:
        "Total capacitance of the island to its surroundings. Must be greater than 0 fF.",
      id: "totalCapacitanceFemtoFarads",
      kind: "number",
      label: "Total capacitance",
      minimum: Number.MIN_VALUE,
      unit: "fF",
    },
  ],
  outputs: [
    {
      description:
        "Blockade voltage threshold for single-electron charging. At least 0 mV.",
      format: "voltage-mv",
      id: "blockadeMillivolts",
      kind: "number",
      label: "Blockade voltage",
      minimum: Number.MIN_VALUE,
      unit: "mV",
    },
  ],
  title: "Coulomb Blockade Voltage Calculator",
});
export const runCoulombBlockadeVoltage = coulombBlockadeVoltageTool.execute;
export default coulombBlockadeVoltageTool;
