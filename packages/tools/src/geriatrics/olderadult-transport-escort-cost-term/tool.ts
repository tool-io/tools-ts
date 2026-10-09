import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly escortHours: number;
  readonly suppliedHourlyCost: number;
  readonly fixedTransportCost: number;
};
export type Output = {
  readonly escortCost: number;
  readonly totalCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    escortHours: { type: "number", minimum: 0 },
    suppliedHourlyCost: { type: "number", minimum: 0 },
    fixedTransportCost: { type: "number", minimum: 0 },
  },
  required: ["escortHours", "suppliedHourlyCost", "fixedTransportCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { escortCost: { type: "number" }, totalCost: { type: "number" } },
  required: ["escortCost", "totalCost"],
} as const;
/** Combine supplied escort hourly cost and fixed transport cost without deciding escort need or reimbursement eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { escortHours, suppliedHourlyCost, fixedTransportCost } = request;
  const compute = (): Output => {
    H.domain(escortHours >= 0, "escortHours");
    H.domain(suppliedHourlyCost >= 0, "suppliedHourlyCost");
    H.domain(fixedTransportCost >= 0, "fixedTransportCost");
    return {
      escortCost: escortHours * suppliedHourlyCost,
      totalCost: escortHours * suppliedHourlyCost + fixedTransportCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { escortHours: 2, suppliedHourlyCost: 20, fixedTransportCost: 15 },
  output: { escortCost: 40, totalCost: 55 },
} satisfies ToolExample<Input, Output>;
export const olderadultTransportEscortCostTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/olderadult-transport-escort-cost-term",
    title: "Older Adult Transport Escort Cost Term Tool",
    description:
      "Combine supplied escort hourly cost and fixed transport cost without deciding escort need or reimbursement eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        escortHours: { type: "number", minimum: 0 },
        suppliedHourlyCost: { type: "number", minimum: 0 },
        fixedTransportCost: { type: "number", minimum: 0 },
      },
      required: ["escortHours", "suppliedHourlyCost", "fixedTransportCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        escortCost: { type: "number" },
        totalCost: { type: "number" },
      },
      required: ["escortCost", "totalCost"],
    },
    ports: {
      inputs: [
        {
          id: "escortHours",
          label: "Escort Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedHourlyCost",
          label: "Supplied Hourly Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedTransportCost",
          label: "Fixed Transport Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "escortCost",
          label: "Escort Cost",
          valueType: { type: "number" },
        },
        { id: "totalCost", label: "Total Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = olderadultTransportEscortCostTermTool.execute;
export default olderadultTransportEscortCostTermTool;
