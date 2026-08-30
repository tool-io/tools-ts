import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const riskEntries = {
  basePreparation: {
    keyDate: "before firing",
    statement:
      "Contamination, flatness, metal-enamel expansion behavior, and support conditions can initiate defects before the dial reaches the kiln.",
  },
  colorDependence: {
    keyDate: "firing process",
    statement:
      "Enamel composition and color respond differently to heat, so a temperature from one process or color cannot be transferred to another dial.",
  },
  inspection: {
    keyDate: "after every firing",
    statement:
      "Grand Feu dials require inspection, flattening, and rejection for cracks, bubbles, pinholes, flow defects, or color problems after each thermal cycle.",
  },
  repeatedFiring: {
    keyDate: "successive layers",
    statement:
      "Successive enamel layers and decoration require repeated firings; each cycle can crack, bubble, or damage work already completed.",
  },
  thermalStress: {
    keyDate: "heating and cooling",
    statement:
      "Differential expansion between enamel and metal, plus heating and cooling gradients, is a central crack risk; there is no universal crack probability.",
  },
} as const;

export type GrandFeuRiskFocus = keyof typeof riskEntries;

export type GrandFeuRiskLookupInput = {
  readonly riskFocus: GrandFeuRiskFocus;
};

export type GrandFeuRiskLookupOutput = {
  readonly riskFocus: GrandFeuRiskFocus;
  readonly riskStatement: string;
  readonly uncertaintyCaution: string;
};

export const lookupGrandFeuCrackRisk = (
  input: GrandFeuRiskLookupInput,
): GrandFeuRiskLookupOutput => {
  const entry = riskEntries[input.riskFocus];
  if (entry === undefined)
    simpleError(
      "riskFocus",
      "Grand Feu risk focus is not supported.",
      "unsupported_risk_focus",
    );
  return {
    riskFocus: input.riskFocus,
    riskStatement: entry.statement,
    uncertaintyCaution:
      "These are process-risk factors, not a numeric failure probability. Actual risk depends on enamel, metal, geometry, kiln, operator, cycle count, inspection, and process history.",
  };
};

export const grandFeuRiskExample = {
  input: { riskFocus: "repeatedFiring" },
  output: {
    riskFocus: "repeatedFiring",
    riskStatement:
      "Successive enamel layers and decoration require repeated firings; each cycle can crack, bubble, or damage work already completed.",
    uncertaintyCaution:
      "These are process-risk factors, not a numeric failure probability. Actual risk depends on enamel, metal, geometry, kiln, operator, cycle count, inspection, and process history.",
  },
} satisfies ToolExample<GrandFeuRiskLookupInput, GrandFeuRiskLookupOutput>;

export const grandFeuRiskTool = createSimpleTool({
  calculate: (input) =>
    lookupGrandFeuCrackRisk({
      riskFocus: input.riskFocus as GrandFeuRiskFocus,
    }),
  description:
    "Return Grand Feu thermal-stress, repeated-firing, inspection, preparation, or color-dependence crack-risk factors without inventing a failure percentage.",
  id: "horology/grand-feu-enamel-crack-risk-factor-lookup",
  inputs: [
    {
      enum: [
        "thermalStress",
        "repeatedFiring",
        "inspection",
        "basePreparation",
        "colorDependence",
      ],
      id: "riskFocus",
      kind: "string",
      label: "Grand Feu enamel crack-risk focus",
    },
  ],
  outputs: [
    {
      id: "riskFocus",
      kind: "string",
      label: "Grand Feu enamel crack-risk focus",
    },
    {
      id: "riskStatement",
      kind: "string",
      label: "Grand Feu crack-risk factor",
    },
    {
      id: "uncertaintyCaution",
      kind: "string",
      label: "Risk uncertainty caution",
    },
  ],
  title: "Grand Feu Enamel Crack Risk Factor Lookup",
});

export const runGrandFeuRisk = grandFeuRiskTool.execute;
export default grandFeuRiskTool;
