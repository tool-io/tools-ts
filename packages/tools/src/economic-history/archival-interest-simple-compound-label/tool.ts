import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryId: string;
  readonly interestConvention: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryId: { type: "string", maxLength: 8192, minLength: 1 },
    interestConvention: {
      type: "string",
      maxLength: 8192,
      enum: ["simple", "compound", "unspecified"],
    },
  },
  required: ["entryId", "interestConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied archival interest convention without inferring compounding from notation or computing interest. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryId, interestConvention } = request;
  const compute = (): Output => {
    H.domain(entryId.length > 0, "entryId");
    H.domain(
      ["simple", "compound", "unspecified"].includes(interestConvention),
      "interestConvention",
    );
    return { label: entryId + " [" + interestConvention + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entryId: "E17", interestConvention: "simple" },
  output: { label: "E17 [simple]" },
} satisfies ToolExample<Input, Output>;
export const archivalInterestSimpleCompoundLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economic-history/archival-interest-simple-compound-label",
      title: "Archival Interest Simple Compound Label Tool",
      description:
        "Label a supplied archival interest convention without inferring compounding from notation or computing interest.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          entryId: { type: "string", maxLength: 8192, minLength: 1 },
          interestConvention: {
            type: "string",
            maxLength: 8192,
            enum: ["simple", "compound", "unspecified"],
          },
        },
        required: ["entryId", "interestConvention"],
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
            id: "entryId",
            label: "Entry Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "interestConvention",
            label: "Interest Convention",
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
export const run = archivalInterestSimpleCompoundLabelTool.execute;
export default archivalInterestSimpleCompoundLabelTool;
