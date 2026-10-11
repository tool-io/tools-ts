import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossRent: number;
  readonly suppliedIncentiveCredit: number;
};
export type Output = { readonly netRentAfterCredit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossRent: { type: "number", minimum: 0 },
    suppliedIncentiveCredit: { type: "number", minimum: 0 },
  },
  required: ["grossRent", "suppliedIncentiveCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netRentAfterCredit: { type: "number" } },
  required: ["netRentAfterCredit"],
} as const;
/** Subtract an explicit tenant incentive credit from compatible gross rent without interpreting lease or accounting rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossRent, suppliedIncentiveCredit } = request;
  const compute = (): Output => {
    H.domain(grossRent >= 0 && suppliedIncentiveCredit >= 0, "grossRent");
    return { netRentAfterCredit: grossRent - suppliedIncentiveCredit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossRent: 1000, suppliedIncentiveCredit: 150 },
  output: { netRentAfterCredit: 850 },
} satisfies ToolExample<Input, Output>;
export const leaseTenantIncentiveCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["real-estate", "real estate", "business and finance"],
      keywords: ["real estate", "business and finance"],
    },
    id: "real-estate/lease-tenant-incentive-credit",
    title: "Lease Tenant Incentive Credit",
    description:
      "Subtract an explicit tenant incentive credit from compatible gross rent without interpreting lease or accounting rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossRent: { type: "number", minimum: 0 },
        suppliedIncentiveCredit: { type: "number", minimum: 0 },
      },
      required: ["grossRent", "suppliedIncentiveCredit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netRentAfterCredit: { type: "number" } },
      required: ["netRentAfterCredit"],
    },
    ports: {
      inputs: [
        {
          id: "grossRent",
          label: "Gross Rent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedIncentiveCredit",
          label: "Supplied Incentive Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netRentAfterCredit",
          label: "Net Rent After Credit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = leaseTenantIncentiveCreditTool.execute;
export default leaseTenantIncentiveCreditTool;
