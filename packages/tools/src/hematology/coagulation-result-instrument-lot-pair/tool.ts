import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultId: string;
  readonly instrumentId: string;
  readonly reagentLot: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    instrumentId: { type: "string", maxLength: 8192, minLength: 1 },
    reagentLot: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultId", "instrumentId", "reagentLot"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate explicit coagulation result, instrument and reagent lot identifiers without correcting results or interpreting coagulation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, instrumentId, reagentLot } = request;
  const compute = (): Output => {
    H.domain(resultId.length > 0, "resultId");
    H.domain(instrumentId.length > 0, "instrumentId");
    H.domain(reagentLot.length > 0, "reagentLot");
    return { token: JSON.stringify([resultId, instrumentId, reagentLot]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resultId: "R17", instrumentId: "I4", reagentLot: "L2" },
  output: { token: '["R17","I4","L2"]' },
} satisfies ToolExample<Input, Output>;
export const coagulationResultInstrumentLotPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/coagulation-result-instrument-lot-pair",
    title: "Coagulation Result Instrument Lot Pair Tool",
    description:
      "Associate explicit coagulation result, instrument and reagent lot identifiers without correcting results or interpreting coagulation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultId: { type: "string", maxLength: 8192, minLength: 1 },
        instrumentId: { type: "string", maxLength: 8192, minLength: 1 },
        reagentLot: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultId", "instrumentId", "reagentLot"],
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
          id: "instrumentId",
          label: "Instrument Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reagentLot",
          label: "Reagent Lot",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = coagulationResultInstrumentLotPairTool.execute;
export default coagulationResultInstrumentLotPairTool;
