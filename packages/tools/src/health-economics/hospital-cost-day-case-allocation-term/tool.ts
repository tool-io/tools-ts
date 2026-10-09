import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalCost: number;
  readonly dayCaseWeight: number;
  readonly inpatientWeight: number;
};
export type Output = {
  readonly dayCaseAllocatedCost: number;
  readonly inpatientAllocatedCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCost: { type: "number" },
    dayCaseWeight: { type: "number", minimum: 0 },
    inpatientWeight: { type: "number", minimum: 0 },
  },
  required: ["totalCost", "dayCaseWeight", "inpatientWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dayCaseAllocatedCost: { type: "number" },
    inpatientAllocatedCost: { type: "number" },
  },
  required: ["dayCaseAllocatedCost", "inpatientAllocatedCost"],
} as const;
/** Split a supplied signed hospital cost between two explicit nonnegative allocation weights without deciding cost accounting policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalCost, dayCaseWeight, inpatientWeight } = request;
  const compute = (): Output => {
    H.domain(dayCaseWeight >= 0, "dayCaseWeight");
    H.domain(inpatientWeight >= 0, "inpatientWeight");
    return (() => {
      const totalWeight = dayCaseWeight + inpatientWeight;
      H.domain(
        totalWeight > 0 && Number.isFinite(totalWeight),
        "dayCaseWeight",
      );
      return {
        dayCaseAllocatedCost: totalCost * (dayCaseWeight / totalWeight),
        inpatientAllocatedCost: totalCost * (inpatientWeight / totalWeight),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalCost: 1000, dayCaseWeight: 1, inpatientWeight: 3 },
  output: { dayCaseAllocatedCost: 250, inpatientAllocatedCost: 750 },
} satisfies ToolExample<Input, Output>;
export const hospitalCostDayCaseAllocationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/hospital-cost-day-case-allocation-term",
    title: "Hospital Cost Day Case Allocation Term Tool",
    description:
      "Split a supplied signed hospital cost between two explicit nonnegative allocation weights without deciding cost accounting policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalCost: { type: "number" },
        dayCaseWeight: { type: "number", minimum: 0 },
        inpatientWeight: { type: "number", minimum: 0 },
      },
      required: ["totalCost", "dayCaseWeight", "inpatientWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dayCaseAllocatedCost: { type: "number" },
        inpatientAllocatedCost: { type: "number" },
      },
      required: ["dayCaseAllocatedCost", "inpatientAllocatedCost"],
    },
    ports: {
      inputs: [
        {
          id: "totalCost",
          label: "Total Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dayCaseWeight",
          label: "Day Case Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inpatientWeight",
          label: "Inpatient Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dayCaseAllocatedCost",
          label: "Day Case Allocated Cost",
          valueType: { type: "number" },
        },
        {
          id: "inpatientAllocatedCost",
          label: "Inpatient Allocated Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hospitalCostDayCaseAllocationTermTool.execute;
export default hospitalCostDayCaseAllocationTermTool;
