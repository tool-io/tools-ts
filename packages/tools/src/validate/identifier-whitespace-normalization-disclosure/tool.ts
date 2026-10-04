import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly removeInternal: boolean;
};
export type Output = {
  readonly normalized: string;
  readonly changed: boolean;
  readonly removed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    removeInternal: { type: "boolean" },
  },
  required: ["token", "removeInternal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalized: { type: "string", maxLength: 8192 },
    changed: { type: "boolean" },
    removed: { type: "integer" },
  },
  required: ["normalized", "changed", "removed"],
} as const;
/** Calculate identifier whitespace normalization disclosure from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, removeInternal } = request;
  const compute = (): Output => {
    const normalized = removeInternal ? token.replace(/\s/g, "") : token.trim();
    return {
      normalized,
      changed: normalized !== token,
      removed: token.length - normalized.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: " AB 12 ", removeInternal: true },
  output: { normalized: "AB12", changed: true, removed: 3 },
} satisfies ToolExample<Input, Output>;
export const identifierWhitespaceNormalizationDisclosureTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "validate/identifier-whitespace-normalization-disclosure",
      title: "Identifier Whitespace Normalization Disclosure Tool",
      description:
        "Calculate identifier whitespace normalization disclosure from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          token: { type: "string", maxLength: 8192 },
          removeInternal: { type: "boolean" },
        },
        required: ["token", "removeInternal"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          normalized: { type: "string", maxLength: 8192 },
          changed: { type: "boolean" },
          removed: { type: "integer" },
        },
        required: ["normalized", "changed", "removed"],
      },
      ports: {
        inputs: [
          {
            id: "token",
            label: "Token",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "removeInternal",
            label: "Remove Internal",
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
          { id: "removed", label: "Removed", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = identifierWhitespaceNormalizationDisclosureTool.execute;
export default identifierWhitespaceNormalizationDisclosureTool;
