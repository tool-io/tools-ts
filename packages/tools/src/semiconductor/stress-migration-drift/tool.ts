import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StressMigrationDriftInput = {
  readonly tensileStressMpa: number;
  readonly migrationRateNmPerHourPerMPa: number;
};

export type StressMigrationDriftOutput = {
  readonly voidGrowthNmPerHour: number;
};

export const stressMigrationDriftExample = {
  input: { migrationRateNmPerHourPerMPa: 0.01, tensileStressMpa: 200 },
  output: { voidGrowthNmPerHour: 2 },
} satisfies ToolExample<StressMigrationDriftInput, StressMigrationDriftOutput>;

export const stressMigrationDriftTool = createSimpleTool({
  id: "semiconductor/stress-migration-drift",
  title: "Stress Migration Rate Calculator",
  description:
    "Estimate stress migration void growth rate in interconnects from the tensile stress.",
  inputs: [
    {
      description: "Tensile stress driving void growth in the metal line.",
      id: "tensileStressMpa",
      kind: "number",
      label: "Tensile stress",
      minimum: 0,
      unit: "MPa",
    },
    {
      description:
        "Void growth rate per unit tensile stress for the metallization.",
      id: "migrationRateNmPerHourPerMPa",
      kind: "number",
      label: "Migration rate coefficient",
      minimum: 0,
      unit: "nm/h/MPa",
    },
  ],
  outputs: [
    {
      id: "voidGrowthNmPerHour",
      kind: "number",
      label: "Void growth rate",
      unit: "nm/h",
    },
  ],
  calculate: (input) => {
    const voidGrowthNmPerHour =
      (input.migrationRateNmPerHourPerMPa as number) *
      (input.tensileStressMpa as number);
    if (!Number.isFinite(voidGrowthNmPerHour))
      simpleError(
        "tensileStressMpa",
        "Calculated void growth rate is not finite.",
      );
    return { voidGrowthNmPerHour };
  },
});
export const runStressMigrationDrift = stressMigrationDriftTool.execute;
export default stressMigrationDriftTool;
