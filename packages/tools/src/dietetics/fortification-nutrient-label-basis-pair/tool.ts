import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productId: string;
  readonly nutrientLabelText: string;
  readonly basisText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productId: { type: "string", maxLength: 8192, minLength: 1 },
    nutrientLabelText: { type: "string", maxLength: 8192, minLength: 1 },
    basisText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["productId", "nutrientLabelText", "basisText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit fortified-nutrient label transcription and reporting basis without assessing adequacy or regulation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productId, nutrientLabelText, basisText } = request;
  const compute = (): Output => {
    H.domain(productId.length > 0, "productId");
    H.domain(nutrientLabelText.length > 0, "nutrientLabelText");
    H.domain(basisText.length > 0, "basisText");
    return { token: JSON.stringify([productId, nutrientLabelText, basisText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    productId: "P17",
    nutrientLabelText: "8 mg",
    basisText: "per 100 g",
  },
  output: { token: '["P17","8 mg","per 100 g"]' },
} satisfies ToolExample<Input, Output>;
export const fortificationNutrientLabelBasisPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "dietetics/fortification-nutrient-label-basis-pair",
      title: "Fortification Nutrient Label Basis Pair Tool",
      description:
        "Preserve an explicit fortified-nutrient label transcription and reporting basis without assessing adequacy or regulation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          productId: { type: "string", maxLength: 8192, minLength: 1 },
          nutrientLabelText: { type: "string", maxLength: 8192, minLength: 1 },
          basisText: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["productId", "nutrientLabelText", "basisText"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "productId",
            label: "Product Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "nutrientLabelText",
            label: "Nutrient Label Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "basisText",
            label: "Basis Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = fortificationNutrientLabelBasisPairTool.execute;
export default fortificationNutrientLabelBasisPairTool;
