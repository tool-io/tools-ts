import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly suppliedRatePerDistance: number;
};
export type Output = { readonly reimbursement: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    suppliedRatePerDistance: { type: "number", minimum: 0 },
  },
  required: ["distance", "suppliedRatePerDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reimbursement: { type: "number" } },
  required: ["reimbursement"],
} as const;
/** Multiply supplied legal-aid travel distance by an explicit reimbursement rate without choosing entitlement or rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, suppliedRatePerDistance } = request;
  const compute = (): Output => {
    H.domain(distance >= 0, "distance");
    H.domain(suppliedRatePerDistance >= 0, "suppliedRatePerDistance");
    return { reimbursement: distance * suppliedRatePerDistance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 40, suppliedRatePerDistance: 0.5 },
  output: { reimbursement: 20 },
} satisfies ToolExample<Input, Output>;
export const legalAidTravelReimbursementLineTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["criminal-justice", "criminal justice", "social sciences"],
      keywords: ["criminal justice", "social sciences"],
    },
    id: "criminal-justice/legal-aid-travel-reimbursement-line",
    title: "Legal Aid Travel Reimbursement Line",
    description:
      "Multiply supplied legal-aid travel distance by an explicit reimbursement rate without choosing entitlement or rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number", minimum: 0 },
        suppliedRatePerDistance: { type: "number", minimum: 0 },
      },
      required: ["distance", "suppliedRatePerDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reimbursement: { type: "number" } },
      required: ["reimbursement"],
    },
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRatePerDistance",
          label: "Supplied Rate Per Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reimbursement",
          label: "Reimbursement",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = legalAidTravelReimbursementLineTool.execute;
export default legalAidTravelReimbursementLineTool;
