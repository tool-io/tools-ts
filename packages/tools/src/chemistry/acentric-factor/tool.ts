import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
const ACENTRIC_FACTORS: Record<string, number> = {
  ammonia: 0.253,
  carbon_dioxide: 0.224,
  methane: 0.011,
  nitrogen: 0.037,
  oxygen: 0.022,
  water: 0.344,
};
export const AcentricFactorTool = createSimpleTool({
  id: "chemistry/acentric-factor",
  title: "Acentric Factor Lookup",
  description: "Look up acentric factor omega of a common substance.",
  inputs: [{ id: "substance", label: "Substance", kind: "string" }],
  outputs: [{ id: "omega", label: "Omega", kind: "number" }],
  calculate: (input) => {
    const key = String(input.substance)
      .trim()
      .toLowerCase()
      .replace(/\s+/gu, "_");
    if (!(key in ACENTRIC_FACTORS))
      simpleError("substance", "Unknown substance.", "not_found");
    return { omega: ACENTRIC_FACTORS[key] };
  },
});
export default AcentricFactorTool;
export const runAcentricFactor = AcentricFactorTool.execute;

export type AcentricFactorInput = {
  readonly substance: string;
};

export type AcentricFactorOutput = {
  readonly omega: number;
};

export const acentricFactorExample = {
  input: {
    substance: "water",
  },
  output: {
    omega: 0.344,
  },
} satisfies ToolExample<AcentricFactorInput, AcentricFactorOutput>;
