import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstId: string;
  readonly secondId: string;
  readonly firstPurposes: readonly string[];
  readonly secondPurposes: readonly string[];
  readonly purpose: string;
  readonly firstWithdrawn: boolean;
  readonly secondWithdrawn: boolean;
};
export type Output = {
  readonly sameDeclaredId: boolean;
  readonly purposeShared: boolean;
  readonly allowedUnderFlags: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstId: { type: "string", maxLength: 8192 },
    secondId: { type: "string", maxLength: 8192 },
    firstPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    purpose: { type: "string", maxLength: 8192 },
    firstWithdrawn: { type: "boolean" },
    secondWithdrawn: { type: "boolean" },
  },
  required: [
    "firstId",
    "secondId",
    "firstPurposes",
    "secondPurposes",
    "purpose",
    "firstWithdrawn",
    "secondWithdrawn",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameDeclaredId: { type: "boolean" },
    purposeShared: { type: "boolean" },
    allowedUnderFlags: { type: "boolean" },
  },
  required: ["sameDeclaredId", "purposeShared", "allowedUnderFlags"],
} as const;
/** Audit supplied comparison IDs and purpose permissions without biometric identification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstId,
    secondId,
    firstPurposes,
    secondPurposes,
    purpose,
    firstWithdrawn,
    secondWithdrawn,
  } = request;
  const compute = (): Output => {
    const purposeShared =
      firstPurposes.includes(purpose) && secondPurposes.includes(purpose);
    return {
      sameDeclaredId: firstId === secondId,
      purposeShared,
      allowedUnderFlags: purposeShared && !firstWithdrawn && !secondWithdrawn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstId: "A",
    secondId: "B",
    firstPurposes: ["research"],
    secondPurposes: ["research"],
    purpose: "research",
    firstWithdrawn: false,
    secondWithdrawn: false,
  },
  output: {
    sameDeclaredId: false,
    purposeShared: true,
    allowedUnderFlags: true,
  },
} satisfies ToolExample<Input, Output>;
export const biometricComparisonPairIdentityConsentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biometrics/biometric-comparison-pair-identity-consent",
      title: "Biometric Comparison Pair Identity Consent Tool",
      description:
        "Audit supplied comparison IDs and purpose permissions without biometric identification.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstId: { type: "string", maxLength: 8192 },
          secondId: { type: "string", maxLength: 8192 },
          firstPurposes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          secondPurposes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          purpose: { type: "string", maxLength: 8192 },
          firstWithdrawn: { type: "boolean" },
          secondWithdrawn: { type: "boolean" },
        },
        required: [
          "firstId",
          "secondId",
          "firstPurposes",
          "secondPurposes",
          "purpose",
          "firstWithdrawn",
          "secondWithdrawn",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sameDeclaredId: { type: "boolean" },
          purposeShared: { type: "boolean" },
          allowedUnderFlags: { type: "boolean" },
        },
        required: ["sameDeclaredId", "purposeShared", "allowedUnderFlags"],
      },
      ports: {
        inputs: [
          {
            id: "firstId",
            label: "First Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondId",
            label: "Second Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "firstPurposes",
            label: "First Purposes",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "secondPurposes",
            label: "Second Purposes",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "purpose",
            label: "Purpose",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "firstWithdrawn",
            label: "First Withdrawn",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "secondWithdrawn",
            label: "Second Withdrawn",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "sameDeclaredId",
            label: "Same Declared Id",
            valueType: { type: "boolean" },
          },
          {
            id: "purposeShared",
            label: "Purpose Shared",
            valueType: { type: "boolean" },
          },
          {
            id: "allowedUnderFlags",
            label: "Allowed Under Flags",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biometricComparisonPairIdentityConsentTool.execute;
export default biometricComparisonPairIdentityConsentTool;
