import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultId: string;
  readonly reagentLot: string;
  readonly assayMethod: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    reagentLot: { type: "string", maxLength: 8192, minLength: 1 },
    assayMethod: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultId", "reagentLot", "assayMethod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate explicit endocrine result, lot and assay-method identifiers without harmonizing assays. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, reagentLot, assayMethod } = request;
  const compute = (): Output => {
    H.domain(resultId.length > 0, "resultId");
    H.domain(reagentLot.length > 0, "reagentLot");
    H.domain(assayMethod.length > 0, "assayMethod");
    return { token: JSON.stringify([resultId, reagentLot, assayMethod]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resultId: "R17", reagentLot: "L4", assayMethod: "method M2" },
  output: { token: '["R17","L4","method M2"]' },
} satisfies ToolExample<Input, Output>;
export const endocrineResultLotMethodPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/endocrine-result-lot-method-pair",
    title: "Endocrine Result Lot Method Pair Tool",
    description:
      "Associate explicit endocrine result, lot and assay-method identifiers without harmonizing assays.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultId: { type: "string", maxLength: 8192, minLength: 1 },
        reagentLot: { type: "string", maxLength: 8192, minLength: 1 },
        assayMethod: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultId", "reagentLot", "assayMethod"],
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
          id: "resultId",
          label: "Result Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reagentLot",
          label: "Reagent Lot",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assayMethod",
          label: "Assay Method",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = endocrineResultLotMethodPairTool.execute;
export default endocrineResultLotMethodPairTool;
