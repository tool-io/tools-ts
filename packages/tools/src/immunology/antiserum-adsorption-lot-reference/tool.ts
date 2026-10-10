import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly antiserumLot: string;
  readonly adsorptionRecordId: string;
  readonly sourceReference: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    antiserumLot: { type: "string", maxLength: 8192, minLength: 1 },
    adsorptionRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["antiserumLot", "adsorptionRecordId", "sourceReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link explicitly supplied antiserum adsorption lot and record references without prescribing preparation or assessing specificity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { antiserumLot, adsorptionRecordId, sourceReference } = request;
  const compute = (): Output => {
    H.domain(antiserumLot.length > 0, "antiserumLot");
    H.domain(adsorptionRecordId.length > 0, "adsorptionRecordId");
    H.domain(sourceReference.length > 0, "sourceReference");
    return {
      token: JSON.stringify([
        antiserumLot,
        adsorptionRecordId,
        sourceReference,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    antiserumLot: "L17",
    adsorptionRecordId: "A4",
    sourceReference: "R2",
  },
  output: { token: '["L17","A4","R2"]' },
} satisfies ToolExample<Input, Output>;
export const antiserumAdsorptionLotReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/antiserum-adsorption-lot-reference",
    title: "Antiserum Adsorption Lot Reference Tool",
    description:
      "Link explicitly supplied antiserum adsorption lot and record references without prescribing preparation or assessing specificity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        antiserumLot: { type: "string", maxLength: 8192, minLength: 1 },
        adsorptionRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceReference: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["antiserumLot", "adsorptionRecordId", "sourceReference"],
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
          id: "antiserumLot",
          label: "Antiserum Lot",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "adsorptionRecordId",
          label: "Adsorption Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceReference",
          label: "Source Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = antiserumAdsorptionLotReferenceTool.execute;
export default antiserumAdsorptionLotReferenceTool;
