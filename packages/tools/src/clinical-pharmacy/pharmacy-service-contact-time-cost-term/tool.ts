import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactMinutes: number;
  readonly preparationMinutes: number;
  readonly hourlyCost: number;
  readonly fixedCost: number;
  readonly reimbursed: number;
};
export type Output = {
  readonly personMinutes: number;
  readonly grossCost: number;
  readonly netCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactMinutes: { type: "number", minimum: 0 },
    preparationMinutes: { type: "number", minimum: 0 },
    hourlyCost: { type: "number", minimum: 0 },
    fixedCost: { type: "number", minimum: 0 },
    reimbursed: { type: "number", minimum: 0 },
  },
  required: [
    "contactMinutes",
    "preparationMinutes",
    "hourlyCost",
    "fixedCost",
    "reimbursed",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personMinutes: { type: "number" },
    grossCost: { type: "number" },
    netCost: { type: "number" },
  },
  required: ["personMinutes", "grossCost", "netCost"],
} as const;
/** Calculate pharmacy service contact time cost term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    contactMinutes,
    preparationMinutes,
    hourlyCost,
    fixedCost,
    reimbursed,
  } = request;
  const compute = (): Output => {
    H.domain(
      contactMinutes >= 0 &&
        preparationMinutes >= 0 &&
        hourlyCost >= 0 &&
        fixedCost >= 0 &&
        reimbursed >= 0,
    );
    return {
      personMinutes: contactMinutes + preparationMinutes,
      grossCost:
        ((contactMinutes + preparationMinutes) * hourlyCost) / 60 + fixedCost,
      netCost:
        ((contactMinutes + preparationMinutes) * hourlyCost) / 60 +
        fixedCost -
        reimbursed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    contactMinutes: 20,
    preparationMinutes: 10,
    hourlyCost: 60,
    fixedCost: 5,
    reimbursed: 10,
  },
  output: { personMinutes: 30, grossCost: 35, netCost: 25 },
} satisfies ToolExample<Input, Output>;
export const pharmacyServiceContactTimeCostTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-pharmacy/pharmacy-service-contact-time-cost-term",
    title: "Pharmacy Service Contact Time Cost Term Tool",
    description:
      "Calculate pharmacy service contact time cost term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactMinutes: { type: "number", minimum: 0 },
        preparationMinutes: { type: "number", minimum: 0 },
        hourlyCost: { type: "number", minimum: 0 },
        fixedCost: { type: "number", minimum: 0 },
        reimbursed: { type: "number", minimum: 0 },
      },
      required: [
        "contactMinutes",
        "preparationMinutes",
        "hourlyCost",
        "fixedCost",
        "reimbursed",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personMinutes: { type: "number" },
        grossCost: { type: "number" },
        netCost: { type: "number" },
      },
      required: ["personMinutes", "grossCost", "netCost"],
    },
    ports: {
      inputs: [
        {
          id: "contactMinutes",
          label: "Contact Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "preparationMinutes",
          label: "Preparation Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hourlyCost",
          label: "Hourly Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedCost",
          label: "Fixed Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reimbursed",
          label: "Reimbursed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "personMinutes",
          label: "Person Minutes",
          valueType: { type: "number" },
        },
        { id: "grossCost", label: "Gross Cost", valueType: { type: "number" } },
        { id: "netCost", label: "Net Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pharmacyServiceContactTimeCostTermTool.execute;
export default pharmacyServiceContactTimeCostTermTool;
