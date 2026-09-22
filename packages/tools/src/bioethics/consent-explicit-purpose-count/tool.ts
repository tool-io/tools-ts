import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredPurposes: readonly string[];
  readonly explicitlyConsented: readonly string[];
  readonly withdrawn: readonly string[];
};
export type Output = {
  readonly covered: number;
  readonly missing: number;
  readonly withdrawnRequired: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    explicitlyConsented: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    withdrawn: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredPurposes", "explicitlyConsented", "withdrawn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    covered: { type: "integer" },
    missing: { type: "integer" },
    withdrawnRequired: { type: "integer" },
  },
  required: ["covered", "missing", "withdrawnRequired"],
} as const;
/** Count literal supplied consent-purpose coverage after explicit withdrawals; no legal consent decision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredPurposes, explicitlyConsented, withdrawn } = request;
  const compute = (): Output => {
    return {
      covered:
        new Set(requiredPurposes).size -
        [...new Set(requiredPurposes)].filter(
          (x) => !explicitlyConsented.includes(x) || withdrawn.includes(x),
        ).length,
      missing: [...new Set(requiredPurposes)].filter(
        (x) => !explicitlyConsented.includes(x) || withdrawn.includes(x),
      ).length,
      withdrawnRequired: [...new Set(requiredPurposes)].filter((x) =>
        withdrawn.includes(x),
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredPurposes: ["A", "B"],
    explicitlyConsented: ["A", "B"],
    withdrawn: ["B"],
  },
  output: { covered: 1, missing: 1, withdrawnRequired: 1 },
} satisfies ToolExample<Input, Output>;
export const consentExplicitPurposeCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/consent-explicit-purpose-count",
    title: "Consent Explicit Purpose Count Tool",
    description:
      "Count literal supplied consent-purpose coverage after explicit withdrawals; no legal consent decision.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredPurposes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        explicitlyConsented: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        withdrawn: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredPurposes", "explicitlyConsented", "withdrawn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        covered: { type: "integer" },
        missing: { type: "integer" },
        withdrawnRequired: { type: "integer" },
      },
      required: ["covered", "missing", "withdrawnRequired"],
    },
    ports: {
      inputs: [
        {
          id: "requiredPurposes",
          label: "Required Purposes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "explicitlyConsented",
          label: "Explicitly Consented",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "withdrawn",
          label: "Withdrawn",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "covered", label: "Covered", valueType: { type: "integer" } },
        { id: "missing", label: "Missing", valueType: { type: "integer" } },
        {
          id: "withdrawnRequired",
          label: "Withdrawn Required",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = consentExplicitPurposeCountTool.execute;
export default consentExplicitPurposeCountTool;
