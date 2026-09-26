import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deliveryCost: number;
  readonly deposit: number;
  readonly monthlyAcquisitionSpend: number;
  readonly cycleMonths: number;
};
export type Output = { readonly workingCapital: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deliveryCost: { type: "number", minimum: 0 },
    deposit: { type: "number", minimum: 0 },
    monthlyAcquisitionSpend: { type: "number", minimum: 0 },
    cycleMonths: { type: "number", minimum: 0 },
  },
  required: [
    "deliveryCost",
    "deposit",
    "monthlyAcquisitionSpend",
    "cycleMonths",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { workingCapital: { type: "number" } },
  required: ["workingCapital"],
} as const;
/** One customer cycle funding gap from explicit costs, deposit and elapsed acquisition spend; no revenue recognition model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deliveryCost, deposit, monthlyAcquisitionSpend, cycleMonths } =
    request;
  const compute = (): Output => {
    H.domain(
      deliveryCost >= 0 &&
        deposit >= 0 &&
        monthlyAcquisitionSpend >= 0 &&
        cycleMonths >= 0,
    );
    return {
      workingCapital:
        deliveryCost - deposit + monthlyAcquisitionSpend * cycleMonths,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deliveryCost: 20000,
    deposit: 5000,
    monthlyAcquisitionSpend: 3000,
    cycleMonths: 2,
  },
  output: { workingCapital: 21000 },
} satisfies ToolExample<Input, Output>;
export const startupSalesCycleCashGapTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/startup-sales-cycle-cash-gap-term",
    title: "Startup Sales Cycle Cash Gap Term Tool",
    description:
      "One customer cycle funding gap from explicit costs, deposit and elapsed acquisition spend; no revenue recognition model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deliveryCost: { type: "number", minimum: 0 },
        deposit: { type: "number", minimum: 0 },
        monthlyAcquisitionSpend: { type: "number", minimum: 0 },
        cycleMonths: { type: "number", minimum: 0 },
      },
      required: [
        "deliveryCost",
        "deposit",
        "monthlyAcquisitionSpend",
        "cycleMonths",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { workingCapital: { type: "number" } },
      required: ["workingCapital"],
    },
    ports: {
      inputs: [
        {
          id: "deliveryCost",
          label: "Delivery Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deposit",
          label: "Deposit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "monthlyAcquisitionSpend",
          label: "Monthly Acquisition Spend",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycleMonths",
          label: "Cycle Months",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "workingCapital",
          label: "Working Capital",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = startupSalesCycleCashGapTermTool.execute;
export default startupSalesCycleCashGapTermTool;
