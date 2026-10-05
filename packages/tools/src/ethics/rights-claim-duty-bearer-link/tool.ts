import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly claimId: string; readonly dutyBearerId: string };
export type Output = { readonly linkToken: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimId: { type: "string", maxLength: 8192 },
    dutyBearerId: { type: "string", maxLength: 8192 },
  },
  required: ["claimId", "dutyBearerId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { linkToken: { type: "string", maxLength: 8192 } },
  required: ["linkToken"],
} as const;
/** Encode an explicitly asserted rights-claim and duty-bearer link without establishing legal or moral duties. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimId, dutyBearerId } = request;
  const compute = (): Output => {
    H.domain(claimId.length > 0 && dutyBearerId.length > 0, "claimId");
    return { linkToken: JSON.stringify([claimId, dutyBearerId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { claimId: "C-7", dutyBearerId: "Agency-A" },
  output: { linkToken: '["C-7","Agency-A"]' },
} satisfies ToolExample<Input, Output>;
export const rightsClaimDutyBearerLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/rights-claim-duty-bearer-link",
    title: "Rights Claim Duty Bearer Link Tool",
    description:
      "Encode an explicitly asserted rights-claim and duty-bearer link without establishing legal or moral duties.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimId: { type: "string", maxLength: 8192 },
        dutyBearerId: { type: "string", maxLength: 8192 },
      },
      required: ["claimId", "dutyBearerId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { linkToken: { type: "string", maxLength: 8192 } },
      required: ["linkToken"],
    },
    ports: {
      inputs: [
        {
          id: "claimId",
          label: "Claim Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dutyBearerId",
          label: "Duty Bearer Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "linkToken", label: "Link Token", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = rightsClaimDutyBearerLinkTool.execute;
export default rightsClaimDutyBearerLinkTool;
