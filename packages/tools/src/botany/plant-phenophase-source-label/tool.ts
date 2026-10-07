import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plantId: string;
  readonly phenophaseCode: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plantId: { type: "string", maxLength: 8192, minLength: 1 },
    phenophaseCode: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["plantId", "phenophaseCode", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied phenophase code and source without determining plant developmental state. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plantId, phenophaseCode, source } = request;
  const compute = (): Output => {
    H.domain(plantId.length > 0, "plantId");
    H.domain(phenophaseCode.length > 0, "phenophaseCode");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([plantId, phenophaseCode, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plantId: "P17", phenophaseCode: "FLOWER", source: "Protocol A" },
  output: { token: '["P17","FLOWER","Protocol A"]' },
} satisfies ToolExample<Input, Output>;
export const plantPhenophaseSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["botany", "biology"],
      keywords: ["botany", "biology"],
    },
    id: "botany/plant-phenophase-source-label",
    title: "Plant Phenophase Source Label",
    description:
      "Record a supplied phenophase code and source without determining plant developmental state.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plantId: { type: "string", maxLength: 8192, minLength: 1 },
        phenophaseCode: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["plantId", "phenophaseCode", "source"],
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
          id: "plantId",
          label: "Plant Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "phenophaseCode",
          label: "Phenophase Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = plantPhenophaseSourceLabelTool.execute;
export default plantPhenophaseSourceLabelTool;
