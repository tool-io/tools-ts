import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly permitPrice: number;
  readonly referencePrice: number;
  readonly emissionsUnits: number;
  readonly freeAllocation: number;
};
export type Output = {
  readonly unitGap: number;
  readonly chargeableUnits: number;
  readonly valueGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    permitPrice: { type: "number" },
    referencePrice: { type: "number" },
    emissionsUnits: { type: "number", minimum: 0 },
    freeAllocation: { type: "number", minimum: 0 },
  },
  required: [
    "permitPrice",
    "referencePrice",
    "emissionsUnits",
    "freeAllocation",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitGap: { type: "number" },
    chargeableUnits: { type: "number" },
    valueGap: { type: "number" },
  },
  required: ["unitGap", "chargeableUnits", "valueGap"],
} as const;
/** Compare explicit prices on supplied chargeable units; no market lookup or regulatory obligation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { permitPrice, referencePrice, emissionsUnits, freeAllocation } =
    request;
  const compute = (): Output => {
    H.domain(emissionsUnits >= 0 && freeAllocation >= 0);
    return (() => {
      const unitGap = permitPrice - referencePrice,
        chargeableUnits = Math.max(0, emissionsUnits - freeAllocation);
      return { unitGap, chargeableUnits, valueGap: unitGap * chargeableUnits };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    permitPrice: 12,
    referencePrice: 10,
    emissionsUnits: 100,
    freeAllocation: 20,
  },
  output: { unitGap: 2, chargeableUnits: 80, valueGap: 160 },
} satisfies ToolExample<Input, Output>;
export const permitPriceReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/permit-price-reference-gap",
    title: "Permit Price Reference Gap Tool",
    description:
      "Compare explicit prices on supplied chargeable units; no market lookup or regulatory obligation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        permitPrice: { type: "number" },
        referencePrice: { type: "number" },
        emissionsUnits: { type: "number", minimum: 0 },
        freeAllocation: { type: "number", minimum: 0 },
      },
      required: [
        "permitPrice",
        "referencePrice",
        "emissionsUnits",
        "freeAllocation",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitGap: { type: "number" },
        chargeableUnits: { type: "number" },
        valueGap: { type: "number" },
      },
      required: ["unitGap", "chargeableUnits", "valueGap"],
    },
    ports: {
      inputs: [
        {
          id: "permitPrice",
          label: "Permit Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePrice",
          label: "Reference Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "emissionsUnits",
          label: "Emissions Units",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freeAllocation",
          label: "Free Allocation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "unitGap", label: "Unit Gap", valueType: { type: "number" } },
        {
          id: "chargeableUnits",
          label: "Chargeable Units",
          valueType: { type: "number" },
        },
        { id: "valueGap", label: "Value Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = permitPriceReferenceGapTool.execute;
export default permitPriceReferenceGapTool;
