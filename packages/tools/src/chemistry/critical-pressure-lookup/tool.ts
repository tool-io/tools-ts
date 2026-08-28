import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
const PC: Record<string, number> = {
  water: 22064,
  carbon_dioxide: 7377.3,
  ammonia: 11353,
  methane: 4599.2,
  nitrogen: 3395.8,
  oxygen: 5043,
  hydrogen: 1296.4,
};
export const criticalPressureLookupTool = createSimpleTool({
  id: "chemistry/critical-pressure-lookup",
  title: "Critical Pressure Lookup",
  description:
    "Look up the critical pressure of a common substance by name in kilopascals.",
  inputs: [
    {
      id: "substance",
      label: "Substance",
      kind: "string",
      description: "Substance name.",
    },
  ],
  outputs: [
    {
      id: "criticalPressureKPa",
      label: "Critical pressure",
      kind: "number",
      unit: "kPa",
    },
  ],
  calculate: (input) => {
    const key = String(input.substance)
      .trim()
      .toLowerCase()
      .replace(/\s+/gu, "_");
    if (!(key in PC))
      simpleError("substance", "Unknown substance.", "not_found");
    return { criticalPressureKPa: PC[key] };
  },
});
export const runCriticalPressureLookup = criticalPressureLookupTool.execute;
export default criticalPressureLookupTool;

export type CriticalPressureLookupInput = {
  readonly substance: string;
};

export type CriticalPressureLookupOutput = {
  readonly criticalPressureKPa: number;
};

export const criticalPressureLookupExample = {
  input: {
    substance: "water",
  },
  output: {
    criticalPressureKPa: 22064,
  },
} satisfies ToolExample<
  CriticalPressureLookupInput,
  CriticalPressureLookupOutput
>;
