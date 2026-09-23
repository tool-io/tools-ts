import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly funders: readonly string[];
  readonly declaredFunders: readonly string[];
  readonly conflicts: readonly string[];
  readonly disclosurePresent: boolean;
};
export type Output = {
  readonly undeclared: readonly string[];
  readonly disclosed: boolean;
  readonly hasConflict: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    funders: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    declaredFunders: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    conflicts: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    disclosurePresent: { type: "boolean" },
  },
  required: ["funders", "declaredFunders", "conflicts", "disclosurePresent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    undeclared: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    disclosed: { type: "boolean" },
    hasConflict: { type: "boolean" },
  },
  required: ["undeclared", "disclosed", "hasConflict"],
} as const;
/** Audit supplied funding/disclosure fields without judging research validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { funders, declaredFunders, conflicts, disclosurePresent } = request;
  const compute = (): Output => {
    return {
      undeclared: [
        ...new Set(funders.filter((x) => !declaredFunders.includes(x))),
      ],
      disclosed: disclosurePresent,
      hasConflict: conflicts.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    funders: ["F1", "F2"],
    declaredFunders: ["F1"],
    conflicts: ["employment"],
    disclosurePresent: true,
  },
  output: { undeclared: ["F2"], disclosed: true, hasConflict: true },
} satisfies ToolExample<Input, Output>;
export const chiropracticEvidenceFundingDisclosureFieldTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chiropractic/chiropractic-evidence-funding-disclosure-field",
      title: "Chiropractic Evidence Funding Disclosure Field Tool",
      description:
        "Audit supplied funding/disclosure fields without judging research validity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          funders: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          declaredFunders: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          conflicts: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          disclosurePresent: { type: "boolean" },
        },
        required: [
          "funders",
          "declaredFunders",
          "conflicts",
          "disclosurePresent",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          undeclared: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          disclosed: { type: "boolean" },
          hasConflict: { type: "boolean" },
        },
        required: ["undeclared", "disclosed", "hasConflict"],
      },
      ports: {
        inputs: [
          {
            id: "funders",
            label: "Funders",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "declaredFunders",
            label: "Declared Funders",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "conflicts",
            label: "Conflicts",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "disclosurePresent",
            label: "Disclosure Present",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "undeclared",
            label: "Undeclared",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "disclosed",
            label: "Disclosed",
            valueType: { type: "boolean" },
          },
          {
            id: "hasConflict",
            label: "Has Conflict",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = chiropracticEvidenceFundingDisclosureFieldTool.execute;
export default chiropracticEvidenceFundingDisclosureFieldTool;
