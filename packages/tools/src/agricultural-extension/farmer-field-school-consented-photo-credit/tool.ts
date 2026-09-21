import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly photographer: string;
  readonly creditRequired: boolean;
  readonly creditPresent: boolean;
  readonly permittedPurposes: readonly string[];
  readonly requestedPurpose: string;
  readonly withdrawn: boolean;
};
export type Output = {
  readonly creditMatches: boolean;
  readonly permissionMatches: boolean;
  readonly usableUnderFlags: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    photographer: { type: "string", maxLength: 8192 },
    creditRequired: { type: "boolean" },
    creditPresent: { type: "boolean" },
    permittedPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedPurpose: { type: "string", maxLength: 8192 },
    withdrawn: { type: "boolean" },
  },
  required: [
    "photographer",
    "creditRequired",
    "creditPresent",
    "permittedPurposes",
    "requestedPurpose",
    "withdrawn",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditMatches: { type: "boolean" },
    permissionMatches: { type: "boolean" },
    usableUnderFlags: { type: "boolean" },
  },
  required: ["creditMatches", "permissionMatches", "usableUnderFlags"],
} as const;
/** Audit supplied photo credit and purpose-permission records without publishing a photo. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    photographer,
    creditRequired,
    creditPresent,
    permittedPurposes,
    requestedPurpose,
    withdrawn,
  } = request;
  const compute = (): Output => {
    const creditMatches =
        !creditRequired || (creditPresent && photographer.length > 0),
      permissionMatches =
        permittedPurposes.includes(requestedPurpose) && !withdrawn;
    return {
      creditMatches,
      permissionMatches,
      usableUnderFlags: creditMatches && permissionMatches,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    photographer: "Alex",
    creditRequired: true,
    creditPresent: true,
    permittedPurposes: ["report"],
    requestedPurpose: "report",
    withdrawn: false,
  },
  output: {
    creditMatches: true,
    permissionMatches: true,
    usableUnderFlags: true,
  },
} satisfies ToolExample<Input, Output>;
export const farmerFieldSchoolConsentedPhotoCreditTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-extension/farmer-field-school-consented-photo-credit",
      title: "Farmer Field School Consented Photo Credit Tool",
      description:
        "Audit supplied photo credit and purpose-permission records without publishing a photo.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          photographer: { type: "string", maxLength: 8192 },
          creditRequired: { type: "boolean" },
          creditPresent: { type: "boolean" },
          permittedPurposes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          requestedPurpose: { type: "string", maxLength: 8192 },
          withdrawn: { type: "boolean" },
        },
        required: [
          "photographer",
          "creditRequired",
          "creditPresent",
          "permittedPurposes",
          "requestedPurpose",
          "withdrawn",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          creditMatches: { type: "boolean" },
          permissionMatches: { type: "boolean" },
          usableUnderFlags: { type: "boolean" },
        },
        required: ["creditMatches", "permissionMatches", "usableUnderFlags"],
      },
      ports: {
        inputs: [
          {
            id: "photographer",
            label: "Photographer",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "creditRequired",
            label: "Credit Required",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "creditPresent",
            label: "Credit Present",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "permittedPurposes",
            label: "Permitted Purposes",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "requestedPurpose",
            label: "Requested Purpose",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "withdrawn",
            label: "Withdrawn",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "creditMatches",
            label: "Credit Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "permissionMatches",
            label: "Permission Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "usableUnderFlags",
            label: "Usable Under Flags",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = farmerFieldSchoolConsentedPhotoCreditTool.execute;
export default farmerFieldSchoolConsentedPhotoCreditTool;
