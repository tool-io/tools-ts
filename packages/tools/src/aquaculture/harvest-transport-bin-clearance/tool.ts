import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly loadedBinHeight: number;
  readonly clearOpeningHeight: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loadedBinHeight: { type: "number" },
    clearOpeningHeight: { type: "number" },
  },
  required: ["loadedBinHeight", "clearOpeningHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract a supplied loaded transport-bin height from the clear opening height in the same units without asserting transport suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loadedBinHeight, clearOpeningHeight } = request;
  const compute = (): Output => {
    return { signedGap: clearOpeningHeight - loadedBinHeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { loadedBinHeight: 12, clearOpeningHeight: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const harvestTransportBinClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaculture", "agriculture"],
      keywords: ["aquaculture", "agriculture"],
    },
    id: "aquaculture/harvest-transport-bin-clearance",
    title: "Harvest Transport Bin Clearance",
    description:
      "Subtract a supplied loaded transport-bin height from the clear opening height in the same units without asserting transport suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loadedBinHeight: { type: "number" },
        clearOpeningHeight: { type: "number" },
      },
      required: ["loadedBinHeight", "clearOpeningHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "loadedBinHeight",
          label: "Loaded Bin Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clearOpeningHeight",
          label: "Clear Opening Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = harvestTransportBinClearanceTool.execute;
export default harvestTransportBinClearanceTool;
