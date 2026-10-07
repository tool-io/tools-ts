import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalCharge: number;
  readonly allocationFraction: number;
  readonly fixedCharge: number;
};
export type Output = {
  readonly allocatedVariableCharge: number;
  readonly totalAllocatedCharge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCharge: { type: "number", minimum: 0 },
    allocationFraction: { type: "number", minimum: 0, maximum: 1 },
    fixedCharge: { type: "number", minimum: 0 },
  },
  required: ["totalCharge", "allocationFraction", "fixedCharge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedVariableCharge: { type: "number" },
    totalAllocatedCharge: { type: "number" },
  },
  required: ["allocatedVariableCharge", "totalAllocatedCharge"],
} as const;
/** Allocate an explicit shared-charge fraction and add a distinct fixed internal charge without double-counting it in the shared base. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalCharge, allocationFraction, fixedCharge } = request;
  const compute = (): Output => {
    H.domain(totalCharge >= 0 && fixedCharge >= 0, "totalCharge");
    (H.domain(
      allocationFraction >= 0 && allocationFraction <= 1,
      "allocationFraction",
    ),
      allocationFraction);
    return {
      allocatedVariableCharge: totalCharge * allocationFraction,
      totalAllocatedCharge: totalCharge * allocationFraction + fixedCharge,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalCharge: 1000, allocationFraction: 0.25, fixedCharge: 20 },
  output: { allocatedVariableCharge: 250, totalAllocatedCharge: 270 },
} satisfies ToolExample<Input, Output>;
export const internalChargeFixedShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/internal-charge-fixed-share",
    title: "Internal Charge Fixed Share",
    description:
      "Allocate an explicit shared-charge fraction and add a distinct fixed internal charge without double-counting it in the shared base.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalCharge: { type: "number", minimum: 0 },
        allocationFraction: { type: "number", minimum: 0, maximum: 1 },
        fixedCharge: { type: "number", minimum: 0 },
      },
      required: ["totalCharge", "allocationFraction", "fixedCharge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedVariableCharge: { type: "number" },
        totalAllocatedCharge: { type: "number" },
      },
      required: ["allocatedVariableCharge", "totalAllocatedCharge"],
    },
    ports: {
      inputs: [
        {
          id: "totalCharge",
          label: "Total Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocationFraction",
          label: "Allocation Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedCharge",
          label: "Fixed Charge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "allocatedVariableCharge",
          label: "Allocated Variable Charge",
          valueType: { type: "number" },
        },
        {
          id: "totalAllocatedCharge",
          label: "Total Allocated Charge",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = internalChargeFixedShareTool.execute;
export default internalChargeFixedShareTool;
