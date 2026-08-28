import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
const TC: Record<string, number> = {
  water: 647.096,
  carbon_dioxide: 304.128,
  ammonia: 405.5,
  methane: 190.564,
  nitrogen: 126.192,
  oxygen: 154.581,
  hydrogen: 33.145,
};
export const criticalTemperatureLookupTool = createSimpleTool({
  id: "chemistry/critical-temperature-lookup",
  title: "Critical Temperature Lookup",
  description:
    "Look up the critical temperature of a common substance by name in kelvin.",
  inputs: [
    {
      id: "substance",
      label: "Substance",
      kind: "string",
      description: "Substance name.",
    },
  ],
  outputs: [
    { id: "criticalTempK", label: "Critical temp", kind: "number", unit: "K" },
  ],
  calculate: (input) => {
    const key = String(input.substance)
      .trim()
      .toLowerCase()
      .replace(/\s+/gu, "_");
    if (!(key in TC))
      simpleError("substance", "Unknown substance.", "not_found");
    return { criticalTempK: TC[key] };
  },
});
export const runCriticalTemperatureLookup =
  criticalTemperatureLookupTool.execute;
export default criticalTemperatureLookupTool;

export type CriticalTemperatureLookupInput = {
  readonly substance: string;
};

export type CriticalTemperatureLookupOutput = {
  readonly criticalTempK: number;
};

export const criticalTemperatureLookupExample = {
  input: {
    substance: "water",
  },
  output: {
    criticalTempK: 647.096,
  },
} satisfies ToolExample<
  CriticalTemperatureLookupInput,
  CriticalTemperatureLookupOutput
>;
