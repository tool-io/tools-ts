import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly truthValue: string };
export type Output = { readonly negated: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    truthValue: {
      type: "string",
      maxLength: 8192,
      enum: ["true", "false", "unknown"],
    },
  },
  required: ["truthValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { negated: { type: "string", maxLength: 8192 } },
  required: ["negated"],
} as const;
/** Apply strong Kleene negation to an explicitly supplied true, false, or unknown truth value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { truthValue } = request;
  const compute = (): Output => {
    H.domain(["true", "false", "unknown"].includes(truthValue), "truthValue");
    return {
      negated:
        truthValue === "true"
          ? "false"
          : truthValue === "false"
            ? "true"
            : "unknown",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { truthValue: "true" },
  output: { negated: "false" },
} satisfies ToolExample<Input, Output>;
export const truthValueExplicitThreeValuedNegationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["philosophy"],
        keywords: ["philosophy"],
      },
      id: "philosophy/truth-value-explicit-three-valued-negation",
      title: "Truth Value Explicit Three Valued Negation",
      description:
        "Apply strong Kleene negation to an explicitly supplied true, false, or unknown truth value.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          truthValue: {
            type: "string",
            maxLength: 8192,
            enum: ["true", "false", "unknown"],
          },
        },
        required: ["truthValue"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { negated: { type: "string", maxLength: 8192 } },
        required: ["negated"],
      },
      ports: {
        inputs: [
          {
            id: "truthValue",
            label: "Truth Value",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "negated", label: "Negated", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = truthValueExplicitThreeValuedNegationTool.execute;
export default truthValueExplicitThreeValuedNegationTool;
