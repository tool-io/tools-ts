import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly complaints: number;
  readonly shipped: number;
  readonly returned: number;
  readonly duplicateComplaints: number;
  readonly rateBase: number;
  readonly netShipped: boolean;
};
export type Output = {
  readonly eligibleComplaints: number;
  readonly denominator: number;
  readonly rate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    complaints: { type: "integer", minimum: 0 },
    shipped: { type: "integer", minimum: 1 },
    returned: { type: "integer", minimum: 0 },
    duplicateComplaints: { type: "integer", minimum: 0 },
    rateBase: { type: "number", exclusiveMinimum: 0 },
    netShipped: { type: "boolean" },
  },
  required: [
    "complaints",
    "shipped",
    "returned",
    "duplicateComplaints",
    "rateBase",
    "netShipped",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleComplaints: { type: "integer" },
    denominator: { type: "integer" },
    rate: { type: "number" },
  },
  required: ["eligibleComplaints", "denominator", "rate"],
} as const;
/** Calculate complaint denominator shipped unit basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    complaints,
    shipped,
    returned,
    duplicateComplaints,
    rateBase,
    netShipped,
  } = request;
  const compute = (): Output => {
    H.integer(complaints, 0);
    H.integer(duplicateComplaints, 0, complaints);
    H.integer(shipped, 1);
    H.integer(returned, 0, shipped - 1);
    H.positive(rateBase);
    return {
      eligibleComplaints: complaints - duplicateComplaints,
      denominator: shipped - (netShipped ? returned : 0),
      rate:
        ((complaints - duplicateComplaints) * rateBase) /
        (shipped - (netShipped ? returned : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    complaints: 12,
    shipped: 10000,
    returned: 1000,
    duplicateComplaints: 2,
    rateBase: 1000,
    netShipped: true,
  },
  output: {
    eligibleComplaints: 10,
    denominator: 9000,
    rate: 1.1111111111111112,
  },
} satisfies ToolExample<Input, Output>;
export const complaintDenominatorShippedUnitBasisTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "quality-assurance/complaint-denominator-shipped-unit-basis",
      title: "Complaint Denominator Shipped Unit Basis Tool",
      description:
        "Calculate complaint denominator shipped unit basis from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          complaints: { type: "integer", minimum: 0 },
          shipped: { type: "integer", minimum: 1 },
          returned: { type: "integer", minimum: 0 },
          duplicateComplaints: { type: "integer", minimum: 0 },
          rateBase: { type: "number", exclusiveMinimum: 0 },
          netShipped: { type: "boolean" },
        },
        required: [
          "complaints",
          "shipped",
          "returned",
          "duplicateComplaints",
          "rateBase",
          "netShipped",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligibleComplaints: { type: "integer" },
          denominator: { type: "integer" },
          rate: { type: "number" },
        },
        required: ["eligibleComplaints", "denominator", "rate"],
      },
      ports: {
        inputs: [
          {
            id: "complaints",
            label: "Complaints",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "shipped",
            label: "Shipped",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "returned",
            label: "Returned",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "duplicateComplaints",
            label: "Duplicate Complaints",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "rateBase",
            label: "Rate Base",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "netShipped",
            label: "Net Shipped",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "eligibleComplaints",
            label: "Eligible Complaints",
            valueType: { type: "integer" },
          },
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          { id: "rate", label: "Rate", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = complaintDenominatorShippedUnitBasisTool.execute;
export default complaintDenominatorShippedUnitBasisTool;
