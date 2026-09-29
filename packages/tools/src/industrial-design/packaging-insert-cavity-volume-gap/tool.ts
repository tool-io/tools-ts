import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cavityVolume: number;
  readonly productVolume: number;
};
export type Output = {
  readonly voidVolume: number;
  readonly fitsByVolume: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cavityVolume: { type: "number", minimum: 0 },
    productVolume: { type: "number", minimum: 0 },
  },
  required: ["cavityVolume", "productVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voidVolume: { type: "number" },
    fitsByVolume: { type: "boolean" },
  },
  required: ["voidVolume", "fitsByVolume"],
} as const;
/** Compare volumes only; a nonnegative gap does not establish geometric fit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cavityVolume, productVolume } = request;
  const compute = (): Output => {
    H.domain(cavityVolume >= 0 && productVolume >= 0);
    return {
      voidVolume: cavityVolume - productVolume,
      fitsByVolume: productVolume <= cavityVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cavityVolume: 120, productVolume: 100 },
  output: { voidVolume: 20, fitsByVolume: true },
} satisfies ToolExample<Input, Output>;
export const packagingInsertCavityVolumeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/packaging-insert-cavity-volume-gap",
    title: "Packaging Insert Cavity Volume Gap Tool",
    description:
      "Compare volumes only; a nonnegative gap does not establish geometric fit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cavityVolume: { type: "number", minimum: 0 },
        productVolume: { type: "number", minimum: 0 },
      },
      required: ["cavityVolume", "productVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voidVolume: { type: "number" },
        fitsByVolume: { type: "boolean" },
      },
      required: ["voidVolume", "fitsByVolume"],
    },
    ports: {
      inputs: [
        {
          id: "cavityVolume",
          label: "Cavity Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "productVolume",
          label: "Product Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "voidVolume",
          label: "Void Volume",
          valueType: { type: "number" },
        },
        {
          id: "fitsByVolume",
          label: "Fits By Volume",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = packagingInsertCavityVolumeGapTool.execute;
export default packagingInsertCavityVolumeGapTool;
