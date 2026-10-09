import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstKind: string; readonly secondKind: string };
export type Output = { readonly known: boolean; readonly mismatched: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstKind: {
      type: "string",
      maxLength: 8192,
      enum: ["number", "length", "unknown"],
    },
    secondKind: {
      type: "string",
      maxLength: 8192,
      enum: ["number", "length", "unknown"],
    },
  },
  required: ["firstKind", "secondKind"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { known: { type: "boolean" }, mismatched: { type: "boolean" } },
  required: ["known", "mismatched"],
} as const;
/** Compare explicit design-token number versus length classifications without parsing units or treating unknown kinds as compatible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstKind, secondKind } = request;
  const compute = (): Output => {
    H.domain(["number", "length", "unknown"].includes(firstKind), "firstKind");
    H.domain(
      ["number", "length", "unknown"].includes(secondKind),
      "secondKind",
    );
    return {
      known: firstKind !== "unknown" && secondKind !== "unknown",
      mismatched:
        firstKind !== "unknown" &&
        secondKind !== "unknown" &&
        firstKind !== secondKind,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstKind: "number", secondKind: "length" },
  output: { known: true, mismatched: true },
} satisfies ToolExample<Input, Output>;
export const designTokenUnitlessLengthMismatchFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "graphic-design/design-token-unitless-length-mismatch-flag",
      title: "Design Token Unitless Length Mismatch Flag Tool",
      description:
        "Compare explicit design-token number versus length classifications without parsing units or treating unknown kinds as compatible.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstKind: {
            type: "string",
            maxLength: 8192,
            enum: ["number", "length", "unknown"],
          },
          secondKind: {
            type: "string",
            maxLength: 8192,
            enum: ["number", "length", "unknown"],
          },
        },
        required: ["firstKind", "secondKind"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          known: { type: "boolean" },
          mismatched: { type: "boolean" },
        },
        required: ["known", "mismatched"],
      },
      ports: {
        inputs: [
          {
            id: "firstKind",
            label: "First Kind",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondKind",
            label: "Second Kind",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "known", label: "Known", valueType: { type: "boolean" } },
          {
            id: "mismatched",
            label: "Mismatched",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = designTokenUnitlessLengthMismatchFlagTool.execute;
export default designTokenUnitlessLengthMismatchFlagTool;
