import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly implantId: string;
  readonly lotId: string;
  readonly manufacturerRecord: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    implantId: { type: "string", maxLength: 8192, minLength: 1 },
    lotId: { type: "string", maxLength: 8192, minLength: 1 },
    manufacturerRecord: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["implantId", "lotId", "manufacturerRecord"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit orthopedic implant and lot identifiers without assessing suitability or regulatory status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { implantId, lotId, manufacturerRecord } = request;
  const compute = (): Output => {
    H.domain(implantId.length > 0, "implantId");
    H.domain(lotId.length > 0, "lotId");
    H.domain(manufacturerRecord.length > 0, "manufacturerRecord");
    return { token: JSON.stringify([implantId, lotId, manufacturerRecord]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    implantId: "IMP17",
    lotId: "LOT-A",
    manufacturerRecord: "Manufacturer A",
  },
  output: { token: '["IMP17","LOT-A","Manufacturer A"]' },
} satisfies ToolExample<Input, Output>;
export const orthopedicImplantLotLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["orthopedics", "health and medicine"],
      keywords: ["orthopedics", "health and medicine"],
    },
    id: "orthopedics/orthopedic-implant-lot-label",
    title: "Orthopedic Implant Lot Label",
    description:
      "Record explicit orthopedic implant and lot identifiers without assessing suitability or regulatory status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        implantId: { type: "string", maxLength: 8192, minLength: 1 },
        lotId: { type: "string", maxLength: 8192, minLength: 1 },
        manufacturerRecord: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["implantId", "lotId", "manufacturerRecord"],
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
          id: "implantId",
          label: "Implant Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lotId",
          label: "Lot Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "manufacturerRecord",
          label: "Manufacturer Record",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = orthopedicImplantLotLabelTool.execute;
export default orthopedicImplantLotLabelTool;
