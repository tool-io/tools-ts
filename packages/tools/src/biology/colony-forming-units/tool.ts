import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ColonyFormingUnitsInput = {
  readonly cfuPerMl: number;
  readonly cultureVolumeMl: number;
};

export type ColonyFormingUnitsOutput = {
  readonly totalColonies: number;
};

export const colonyFormingUnitsExample = {
  input: { cfuPerMl: 46000, cultureVolumeMl: 0.05 },
  output: { totalColonies: 2300 },
} satisfies ToolExample<ColonyFormingUnitsInput, ColonyFormingUnitsOutput>;

export const colonyFormingUnitsTool = createSimpleTool({
  id: "biology/colony-forming-units",
  title: "CFU Total Estimate",
  description:
    "Estimate the total colony-forming units in a culture from concentration and volume.",
  inputs: [
    { id: "cfuPerMl", label: "CFU per mL", kind: "number", minimum: 0 },
    {
      id: "cultureVolumeMl",
      label: "Culture volume",
      kind: "number",
      minimum: Number.MIN_VALUE,
      unit: "mL",
    },
  ],
  outputs: [{ id: "totalColonies", label: "Total CFU", kind: "number" }],
  calculate: (input) => {
    const cfuPerMl = input.cfuPerMl as number;
    const cultureVolumeMl = input.cultureVolumeMl as number;
    if (cfuPerMl < 0) simpleError("cfuPerMl", "CFU per mL cannot be negative.");
    if (!(cultureVolumeMl > 0))
      simpleError("cultureVolumeMl", "Culture volume must be positive.");
    return { totalColonies: cfuPerMl * cultureVolumeMl };
  },
});
export const runColonyFormingUnits = colonyFormingUnitsTool.execute;
export default colonyFormingUnitsTool;
