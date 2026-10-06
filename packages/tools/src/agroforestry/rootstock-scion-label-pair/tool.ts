import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plantRecordId: string;
  readonly rootstockLabel: string;
  readonly scionLabel: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plantRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    rootstockLabel: { type: "string", maxLength: 8192, minLength: 1 },
    scionLabel: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["plantRecordId", "rootstockLabel", "scionLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicitly supplied rootstock and scion labels without assessing graft compatibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plantRecordId, rootstockLabel, scionLabel } = request;
  const compute = (): Output => {
    H.domain(plantRecordId.length > 0, "plantRecordId");
    H.domain(rootstockLabel.length > 0, "rootstockLabel");
    H.domain(scionLabel.length > 0, "scionLabel");
    return {
      token: JSON.stringify([plantRecordId, rootstockLabel, scionLabel]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    plantRecordId: "P17",
    rootstockLabel: "Rootstock A",
    scionLabel: "Scion B",
  },
  output: { token: '["P17","Rootstock A","Scion B"]' },
} satisfies ToolExample<Input, Output>;
export const rootstockScionLabelPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroforestry", "agriculture"],
      keywords: ["agroforestry", "agriculture"],
    },
    id: "agroforestry/rootstock-scion-label-pair",
    title: "Rootstock Scion Label Pair",
    description:
      "Pair explicitly supplied rootstock and scion labels without assessing graft compatibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plantRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        rootstockLabel: { type: "string", maxLength: 8192, minLength: 1 },
        scionLabel: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["plantRecordId", "rootstockLabel", "scionLabel"],
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
          id: "plantRecordId",
          label: "Plant Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rootstockLabel",
          label: "Rootstock Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "scionLabel",
          label: "Scion Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = rootstockScionLabelPairTool.execute;
export default rootstockScionLabelPairTool;
