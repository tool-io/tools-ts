import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly identifier: string;
  readonly trimOuterSpaces: boolean;
  readonly caseFold: boolean;
};
export type Output = { readonly normalized: string; readonly changed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identifier: { type: "string", maxLength: 8192 },
    trimOuterSpaces: { type: "boolean" },
    caseFold: { type: "boolean" },
  },
  required: ["identifier", "trimOuterSpaces", "caseFold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalized: { type: "string", maxLength: 8192 },
    changed: { type: "boolean" },
  },
  required: ["normalized", "changed"],
} as const;
/** Normalize only explicitly requested ASCII outer spaces and case in a study reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifier, trimOuterSpaces, caseFold } = request;
  const compute = (): Output => {
    H.domain(!/[\r\n\t]/.test(identifier), "identifier");
    let normalized = trimOuterSpaces
      ? identifier.replace(/^ +| +$/g, "")
      : identifier;
    if (caseFold) normalized = normalized.toUpperCase();
    H.domain(normalized.length > 0, "identifier");
    return { normalized, changed: normalized !== identifier };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { identifier: " abc-01 ", trimOuterSpaces: true, caseFold: true },
  output: { normalized: "ABC-01", changed: true },
} satisfies ToolExample<Input, Output>;
export const regulatoryStudyReferenceIdNormalizerTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "regulatory-affairs/regulatory-study-reference-id-normalizer",
      title: "Regulatory Study Reference ID Normalizer Tool",
      description:
        "Normalize only explicitly requested ASCII outer spaces and case in a study reference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          identifier: { type: "string", maxLength: 8192 },
          trimOuterSpaces: { type: "boolean" },
          caseFold: { type: "boolean" },
        },
        required: ["identifier", "trimOuterSpaces", "caseFold"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          normalized: { type: "string", maxLength: 8192 },
          changed: { type: "boolean" },
        },
        required: ["normalized", "changed"],
      },
      ports: {
        inputs: [
          {
            id: "identifier",
            label: "Identifier",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "trimOuterSpaces",
            label: "Trim Outer Spaces",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "caseFold",
            label: "Case Fold",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "normalized",
            label: "Normalized",
            valueType: { type: "string" },
          },
          { id: "changed", label: "Changed", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = regulatoryStudyReferenceIdNormalizerTool.execute;
export default regulatoryStudyReferenceIdNormalizerTool;
