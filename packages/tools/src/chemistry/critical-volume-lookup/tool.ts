import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const CriticalVolumeLookupTool = createSimpleTool({
  id: "chemistry/critical-volume-lookup",
  title: "Critical Volume Lookup",
  description: "Look up critical volume of a common substance by name.",
  inputs: [{ id: "substance", label: "Substance", kind: "string" }],
  outputs: [
    { id: "criticalVolumeLMol", label: "Vc", kind: "number", unit: "L/mol" },
  ],
  calculate: (input) => {
    const VC: Record<string, number> = {
      water: 0.0559,
      carbon_dioxide: 0.0941,
      ammonia: 0.0725,
      methane: 0.0986,
      nitrogen: 0.0898,
    };
    const key = String(input.substance)
      .trim()
      .toLowerCase()
      .replace(/\s+/gu, "_");
    if (!(key in VC))
      simpleError("substance", "Unknown substance.", "not_found");
    return { criticalVolumeLMol: VC[key] };
  },
});
export default CriticalVolumeLookupTool;
export const runCriticalVolumeLookup = CriticalVolumeLookupTool.execute;

export type CriticalVolumeLookupInput = {
  readonly substance: string;
};

export type CriticalVolumeLookupOutput = {
  readonly criticalVolumeLMol: number;
};

export const criticalVolumeLookupExample = {
  input: {
    substance: "water",
  },
  output: {
    criticalVolumeLMol: 0.0559,
  },
} satisfies ToolExample<CriticalVolumeLookupInput, CriticalVolumeLookupOutput>;
