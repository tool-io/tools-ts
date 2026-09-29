import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specificStorage: number;
  readonly aquiferVolume: number;
  readonly headChange: number;
};
export type Output = { readonly storedWaterChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specificStorage: { type: "number", minimum: 0 },
    aquiferVolume: { type: "number", minimum: 0 },
    headChange: { type: "number" },
  },
  required: ["specificStorage", "aquiferVolume", "headChange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { storedWaterChange: { type: "number" } },
  required: ["storedWaterChange"],
} as const;
/** Calculate specific storage head change volume from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specificStorage, aquiferVolume, headChange } = request;
  const compute = (): Output => {
    H.domain(specificStorage >= 0 && aquiferVolume >= 0);
    return { storedWaterChange: specificStorage * aquiferVolume * headChange };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specificStorage: 0.0001, aquiferVolume: 100000, headChange: 2 },
  output: { storedWaterChange: 20 },
} satisfies ToolExample<Input, Output>;
export const specificStorageHeadChangeVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/specific-storage-head-change-volume",
    title: "Specific Storage Head Change Volume Tool",
    description:
      "Calculate specific storage head change volume from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specificStorage: { type: "number", minimum: 0 },
        aquiferVolume: { type: "number", minimum: 0 },
        headChange: { type: "number" },
      },
      required: ["specificStorage", "aquiferVolume", "headChange"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { storedWaterChange: { type: "number" } },
      required: ["storedWaterChange"],
    },
    ports: {
      inputs: [
        {
          id: "specificStorage",
          label: "Specific Storage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aquiferVolume",
          label: "Aquifer Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "headChange",
          label: "Head Change",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "storedWaterChange",
          label: "Stored Water Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = specificStorageHeadChangeVolumeTool.execute;
export default specificStorageHeadChangeVolumeTool;
