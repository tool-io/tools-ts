import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly buildId: string;
  readonly materialId: string;
  readonly lotId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    buildId: { type: "string", maxLength: 8192, minLength: 1 },
    materialId: { type: "string", maxLength: 8192, minLength: 1 },
    lotId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["buildId", "materialId", "lotId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit fabrication material-lot reference without providing a material formulation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { buildId, materialId, lotId } = request;
  const compute = (): Output => {
    H.domain(buildId.length > 0, "buildId");
    H.domain(materialId.length > 0, "materialId");
    H.domain(lotId.length > 0, "lotId");
    return { token: JSON.stringify([buildId, materialId, lotId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { buildId: "BUILD17", materialId: "MAT2", lotId: "LOT2" },
  output: { token: '["BUILD17","MAT2","LOT2"]' },
} satisfies ToolExample<Input, Output>;
export const biofabricationMaterialLotLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biofabrication", "engineering"],
      keywords: ["biofabrication", "engineering"],
    },
    id: "biofabrication/biofabrication-material-lot-label",
    title: "Biofabrication Material Lot Label",
    description:
      "Qualify an explicit fabrication material-lot reference without providing a material formulation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        buildId: { type: "string", maxLength: 8192, minLength: 1 },
        materialId: { type: "string", maxLength: 8192, minLength: 1 },
        lotId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["buildId", "materialId", "lotId"],
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
          id: "buildId",
          label: "Build Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "materialId",
          label: "Material Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lotId",
          label: "Lot Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biofabricationMaterialLotLabelTool.execute;
export default biofabricationMaterialLotLabelTool;
