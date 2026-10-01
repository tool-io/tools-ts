import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inletConcentration: number;
  readonly outletConcentration: number;
  readonly inletFlow: number;
  readonly outletFlow: number;
};
export type Output = {
  readonly removedMassRate: number;
  readonly inletEquivalentClearance: number;
  readonly extractionFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inletConcentration: { type: "number", exclusiveMinimum: 0 },
    outletConcentration: { type: "number", minimum: 0 },
    inletFlow: { type: "number", minimum: 0 },
    outletFlow: { type: "number", minimum: 0 },
  },
  required: [
    "inletConcentration",
    "outletConcentration",
    "inletFlow",
    "outletFlow",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    removedMassRate: { type: "number" },
    inletEquivalentClearance: { type: "number" },
    extractionFraction: { type: "number" },
  },
  required: [
    "removedMassRate",
    "inletEquivalentClearance",
    "extractionFraction",
  ],
} as const;
/** Bench mass-balance clearance from explicit measured concentrations and flows, not a treatment adequacy or prescription calculation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inletConcentration, outletConcentration, inletFlow, outletFlow } =
    request;
  const compute = (): Output => {
    H.positive(inletConcentration);
    H.domain(outletConcentration >= 0 && inletFlow >= 0 && outletFlow >= 0);
    return {
      removedMassRate:
        inletConcentration * inletFlow - outletConcentration * outletFlow,
      inletEquivalentClearance:
        (inletConcentration * inletFlow - outletConcentration * outletFlow) /
        inletConcentration,
      extractionFraction: 1 - outletConcentration / inletConcentration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inletConcentration: 10,
    outletConcentration: 4,
    inletFlow: 100,
    outletFlow: 100,
  },
  output: {
    removedMassRate: 600,
    inletEquivalentClearance: 60,
    extractionFraction: 0.6,
  },
} satisfies ToolExample<Input, Output>;
export const dialysisBenchClearanceFlowBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nephrology/dialysis-bench-clearance-flow-balance",
    title: "Dialysis Bench Clearance Flow Balance Tool",
    description:
      "Bench mass-balance clearance from explicit measured concentrations and flows, not a treatment adequacy or prescription calculation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inletConcentration: { type: "number", exclusiveMinimum: 0 },
        outletConcentration: { type: "number", minimum: 0 },
        inletFlow: { type: "number", minimum: 0 },
        outletFlow: { type: "number", minimum: 0 },
      },
      required: [
        "inletConcentration",
        "outletConcentration",
        "inletFlow",
        "outletFlow",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        removedMassRate: { type: "number" },
        inletEquivalentClearance: { type: "number" },
        extractionFraction: { type: "number" },
      },
      required: [
        "removedMassRate",
        "inletEquivalentClearance",
        "extractionFraction",
      ],
    },
    ports: {
      inputs: [
        {
          id: "inletConcentration",
          label: "Inlet Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outletConcentration",
          label: "Outlet Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inletFlow",
          label: "Inlet Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outletFlow",
          label: "Outlet Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "removedMassRate",
          label: "Removed Mass Rate",
          valueType: { type: "number" },
        },
        {
          id: "inletEquivalentClearance",
          label: "Inlet Equivalent Clearance",
          valueType: { type: "number" },
        },
        {
          id: "extractionFraction",
          label: "Extraction Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dialysisBenchClearanceFlowBalanceTool.execute;
export default dialysisBenchClearanceFlowBalanceTool;
