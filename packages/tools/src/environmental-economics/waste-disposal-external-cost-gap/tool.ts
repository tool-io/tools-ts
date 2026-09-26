import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tonnes: number;
  readonly privateCostPerTonne: number;
  readonly socialCostPerTonne: number;
  readonly chargedTaxPerTonne: number;
};
export type Output = {
  readonly externalCostPerTonne: number;
  readonly residualWedge: number;
  readonly totalResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tonnes: { type: "number", minimum: 0 },
    privateCostPerTonne: { type: "number" },
    socialCostPerTonne: { type: "number" },
    chargedTaxPerTonne: { type: "number" },
  },
  required: [
    "tonnes",
    "privateCostPerTonne",
    "socialCostPerTonne",
    "chargedTaxPerTonne",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    externalCostPerTonne: { type: "number" },
    residualWedge: { type: "number" },
    totalResidual: { type: "number" },
  },
  required: ["externalCostPerTonne", "residualWedge", "totalResidual"],
} as const;
/** Calculate waste disposal external cost gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    tonnes,
    privateCostPerTonne,
    socialCostPerTonne,
    chargedTaxPerTonne,
  } = request;
  const compute = (): Output => {
    H.domain(tonnes >= 0);
    return {
      externalCostPerTonne: socialCostPerTonne - privateCostPerTonne,
      residualWedge:
        socialCostPerTonne - privateCostPerTonne - chargedTaxPerTonne,
      totalResidual:
        tonnes *
        (socialCostPerTonne - privateCostPerTonne - chargedTaxPerTonne),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tonnes: 100,
    privateCostPerTonne: 30,
    socialCostPerTonne: 50,
    chargedTaxPerTonne: 10,
  },
  output: { externalCostPerTonne: 20, residualWedge: 10, totalResidual: 1000 },
} satisfies ToolExample<Input, Output>;
export const wasteDisposalExternalCostGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/waste-disposal-external-cost-gap",
    title: "Waste Disposal External Cost Gap Tool",
    description:
      "Calculate waste disposal external cost gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tonnes: { type: "number", minimum: 0 },
        privateCostPerTonne: { type: "number" },
        socialCostPerTonne: { type: "number" },
        chargedTaxPerTonne: { type: "number" },
      },
      required: [
        "tonnes",
        "privateCostPerTonne",
        "socialCostPerTonne",
        "chargedTaxPerTonne",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        externalCostPerTonne: { type: "number" },
        residualWedge: { type: "number" },
        totalResidual: { type: "number" },
      },
      required: ["externalCostPerTonne", "residualWedge", "totalResidual"],
    },
    ports: {
      inputs: [
        {
          id: "tonnes",
          label: "Tonnes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "privateCostPerTonne",
          label: "Private Cost Per Tonne",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "socialCostPerTonne",
          label: "Social Cost Per Tonne",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "chargedTaxPerTonne",
          label: "Charged Tax Per Tonne",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "externalCostPerTonne",
          label: "External Cost Per Tonne",
          valueType: { type: "number" },
        },
        {
          id: "residualWedge",
          label: "Residual Wedge",
          valueType: { type: "number" },
        },
        {
          id: "totalResidual",
          label: "Total Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wasteDisposalExternalCostGapTool.execute;
export default wasteDisposalExternalCostGapTool;
