import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly statementId: string;
  readonly suppliedDirection: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    statementId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedDirection: {
      type: "string",
      maxLength: 8192,
      enum: ["necessary", "sufficient", "both", "neither", "unspecified"],
    },
  },
  required: ["statementId", "suppliedDirection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied necessity or sufficiency direction without interpreting natural-language conditionals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { statementId, suppliedDirection } = request;
  const compute = (): Output => {
    H.domain(statementId.length > 0, "statementId");
    H.domain(
      ["necessary", "sufficient", "both", "neither", "unspecified"].includes(
        suppliedDirection,
      ),
      "suppliedDirection",
    );
    return { label: statementId + " [" + suppliedDirection + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { statementId: "S17", suppliedDirection: "necessary" },
  output: { label: "S17 [necessary]" },
} satisfies ToolExample<Input, Output>;
export const conditionalNecessarySufficientDirectionTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["philosophy"],
        keywords: ["philosophy"],
      },
      id: "philosophy/conditional-necessary-sufficient-direction-tag",
      title: "Conditional Necessary Sufficient Direction Tag",
      description:
        "Label an explicitly supplied necessity or sufficiency direction without interpreting natural-language conditionals.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          statementId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedDirection: {
            type: "string",
            maxLength: 8192,
            enum: ["necessary", "sufficient", "both", "neither", "unspecified"],
          },
        },
        required: ["statementId", "suppliedDirection"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "statementId",
            label: "Statement Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedDirection",
            label: "Supplied Direction",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = conditionalNecessarySufficientDirectionTagTool.execute;
export default conditionalNecessarySufficientDirectionTagTool;
