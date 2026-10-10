import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productId: string;
  readonly solventWording: string;
  readonly volumeUnit: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productId: { type: "string", maxLength: 8192, minLength: 1 },
    solventWording: { type: "string", maxLength: 8192, minLength: 1 },
    volumeUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["productId", "solventWording", "volumeUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit solvent and volume-unit wording without recommending preparation or use. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productId, solventWording, volumeUnit } = request;
  const compute = (): Output => {
    H.domain(productId.length > 0, "productId");
    H.domain(solventWording.length > 0, "solventWording");
    H.domain(volumeUnit.length > 0, "volumeUnit");
    return { token: JSON.stringify([productId, solventWording, volumeUnit]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { productId: "PR17", solventWording: "solvent A", volumeUnit: "mL" },
  output: { token: '["PR17","solvent A","mL"]' },
} satisfies ToolExample<Input, Output>;
export const homeopathySolventVolumeUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["homeopathy", "health and medicine"],
      keywords: ["homeopathy", "health and medicine"],
    },
    id: "homeopathy/homeopathy-solvent-volume-unit",
    title: "Homeopathy Solvent Volume Unit",
    description:
      "Record explicit solvent and volume-unit wording without recommending preparation or use.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productId: { type: "string", maxLength: 8192, minLength: 1 },
        solventWording: { type: "string", maxLength: 8192, minLength: 1 },
        volumeUnit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["productId", "solventWording", "volumeUnit"],
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
          id: "solventWording",
          label: "Solvent Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "volumeUnit",
          label: "Volume Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = homeopathySolventVolumeUnitTool.execute;
export default homeopathySolventVolumeUnitTool;
