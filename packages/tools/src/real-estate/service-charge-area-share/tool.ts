import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalServiceCharge: number;
  readonly unitChargeableArea: number;
  readonly totalChargeableArea: number;
};
export type Output = {
  readonly allocationShare: number;
  readonly unitCharge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalServiceCharge: { type: "number", minimum: 0 },
    unitChargeableArea: { type: "number", minimum: 0 },
    totalChargeableArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["totalServiceCharge", "unitChargeableArea", "totalChargeableArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocationShare: { type: "number" },
    unitCharge: { type: "number" },
  },
  required: ["allocationShare", "unitCharge"],
} as const;
/** Allocate an explicit service-charge total by chargeable area without inferring lease exclusions or legal recoverability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalServiceCharge, unitChargeableArea, totalChargeableArea } =
    request;
  const compute = (): Output => {
    H.domain(totalServiceCharge >= 0, "totalServiceCharge");
    (H.domain(totalChargeableArea > 0, "totalChargeableArea"),
      totalChargeableArea);
    H.domain(
      unitChargeableArea >= 0 && unitChargeableArea <= totalChargeableArea,
      "unitChargeableArea",
    );
    return {
      allocationShare: unitChargeableArea / totalChargeableArea,
      unitCharge:
        (totalServiceCharge * unitChargeableArea) / totalChargeableArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalServiceCharge: 10000,
    unitChargeableArea: 80,
    totalChargeableArea: 1000,
  },
  output: { allocationShare: 0.08, unitCharge: 800 },
} satisfies ToolExample<Input, Output>;
export const serviceChargeAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/service-charge-area-share",
    title: "Service Charge Area Share Tool",
    description:
      "Allocate an explicit service-charge total by chargeable area without inferring lease exclusions or legal recoverability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalServiceCharge: { type: "number", minimum: 0 },
        unitChargeableArea: { type: "number", minimum: 0 },
        totalChargeableArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "totalServiceCharge",
        "unitChargeableArea",
        "totalChargeableArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocationShare: { type: "number" },
        unitCharge: { type: "number" },
      },
      required: ["allocationShare", "unitCharge"],
    },
    ports: {
      inputs: [
        {
          id: "totalServiceCharge",
          label: "Total Service Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitChargeableArea",
          label: "Unit Chargeable Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalChargeableArea",
          label: "Total Chargeable Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "allocationShare",
          label: "Allocation Share",
          valueType: { type: "number" },
        },
        {
          id: "unitCharge",
          label: "Unit Charge",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = serviceChargeAreaShareTool.execute;
export default serviceChargeAreaShareTool;
