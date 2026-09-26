import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingCredit: number;
  readonly newExportCredit: number;
  readonly importCharge: number;
  readonly expiringUnusedCredit: number;
};
export type Output = {
  readonly creditApplied: number;
  readonly unusedBeforeExpiry: number;
  readonly closingCredit: number;
  readonly expired: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingCredit: { type: "number", minimum: 0 },
    newExportCredit: { type: "number", minimum: 0 },
    importCharge: { type: "number", minimum: 0 },
    expiringUnusedCredit: { type: "number", minimum: 0 },
  },
  required: [
    "openingCredit",
    "newExportCredit",
    "importCharge",
    "expiringUnusedCredit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditApplied: { type: "number" },
    unusedBeforeExpiry: { type: "number" },
    closingCredit: { type: "number" },
    expired: { type: "number" },
  },
  required: ["creditApplied", "unusedBeforeExpiry", "closingCredit", "expired"],
} as const;
/** Explicit aggregate credit application followed by expiry of a caller-identified unused amount; no vintage ordering is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingCredit, newExportCredit, importCharge, expiringUnusedCredit } =
    request;
  const compute = (): Output => {
    H.domain(
      openingCredit >= 0 &&
        newExportCredit >= 0 &&
        importCharge >= 0 &&
        expiringUnusedCredit >= 0,
    );
    return {
      creditApplied: Math.min(openingCredit + newExportCredit, importCharge),
      unusedBeforeExpiry: Math.max(
        0,
        openingCredit + newExportCredit - importCharge,
      ),
      closingCredit:
        Math.max(0, openingCredit + newExportCredit - importCharge) -
        Math.min(
          expiringUnusedCredit,
          Math.max(0, openingCredit + newExportCredit - importCharge),
        ),
      expired: Math.min(
        expiringUnusedCredit,
        Math.max(0, openingCredit + newExportCredit - importCharge),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingCredit: 20,
    newExportCredit: 30,
    importCharge: 35,
    expiringUnusedCredit: 10,
  },
  output: {
    creditApplied: 35,
    unusedBeforeExpiry: 15,
    closingCredit: 5,
    expired: 10,
  },
} satisfies ToolExample<Input, Output>;
export const netbillingUnusedExportcreditExpiryTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "energy-economics/netbilling-unused-exportcredit-expiry-term",
      title: "Netbilling Unused Exportcredit Expiry Term Tool",
      description:
        "Explicit aggregate credit application followed by expiry of a caller-identified unused amount; no vintage ordering is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openingCredit: { type: "number", minimum: 0 },
          newExportCredit: { type: "number", minimum: 0 },
          importCharge: { type: "number", minimum: 0 },
          expiringUnusedCredit: { type: "number", minimum: 0 },
        },
        required: [
          "openingCredit",
          "newExportCredit",
          "importCharge",
          "expiringUnusedCredit",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          creditApplied: { type: "number" },
          unusedBeforeExpiry: { type: "number" },
          closingCredit: { type: "number" },
          expired: { type: "number" },
        },
        required: [
          "creditApplied",
          "unusedBeforeExpiry",
          "closingCredit",
          "expired",
        ],
      },
      ports: {
        inputs: [
          {
            id: "openingCredit",
            label: "Opening Credit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "newExportCredit",
            label: "New Export Credit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "importCharge",
            label: "Import Charge",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "expiringUnusedCredit",
            label: "Expiring Unused Credit",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "creditApplied",
            label: "Credit Applied",
            valueType: { type: "number" },
          },
          {
            id: "unusedBeforeExpiry",
            label: "Unused Before Expiry",
            valueType: { type: "number" },
          },
          {
            id: "closingCredit",
            label: "Closing Credit",
            valueType: { type: "number" },
          },
          { id: "expired", label: "Expired", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = netbillingUnusedExportcreditExpiryTermTool.execute;
export default netbillingUnusedExportcreditExpiryTermTool;
