import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly tubeLot: string;
  readonly additiveWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    tubeLot: { type: "string", maxLength: 8192, minLength: 1 },
    additiveWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "tubeLot", "additiveWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate a supplied coagulation specimen with a tube lot and literal additive wording without checking suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, tubeLot, additiveWording } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(tubeLot.length > 0, "tubeLot");
    H.domain(additiveWording.length > 0, "additiveWording");
    return { token: JSON.stringify([specimenId, tubeLot, additiveWording]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenId: "S17",
    tubeLot: "LOT-A",
    additiveWording: "recorded additive A",
  },
  output: { token: '["S17","LOT-A","recorded additive A"]' },
} satisfies ToolExample<Input, Output>;
export const coagulationTubeLotTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hematology", "health and medicine"],
      keywords: ["hematology", "health and medicine"],
    },
    id: "hematology/coagulation-tube-lot-token",
    title: "Coagulation Tube Lot Token",
    description:
      "Associate a supplied coagulation specimen with a tube lot and literal additive wording without checking suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        tubeLot: { type: "string", maxLength: 8192, minLength: 1 },
        additiveWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "tubeLot", "additiveWording"],
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
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "tubeLot",
          label: "Tube Lot",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "additiveWording",
          label: "Additive Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = coagulationTubeLotTokenTool.execute;
export default coagulationTubeLotTokenTool;
