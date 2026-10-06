import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly makeupWaterVolume: number;
  readonly totalInputWaterVolume: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    makeupWaterVolume: { type: "number", minimum: 0 },
    totalInputWaterVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["makeupWaterVolume", "totalInputWaterVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize explicit makeup-water volume to compatible total input water without estimating system water demand. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { makeupWaterVolume, totalInputWaterVolume } = request;
  const compute = (): Output => {
    (H.domain(totalInputWaterVolume > 0, "totalInputWaterVolume"),
      totalInputWaterVolume);
    H.domain(
      makeupWaterVolume >= 0 && makeupWaterVolume <= totalInputWaterVolume,
      "makeupWaterVolume",
    );
    return {
      fraction: makeupWaterVolume / totalInputWaterVolume,
      remainder: totalInputWaterVolume - makeupWaterVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { makeupWaterVolume: 30, totalInputWaterVolume: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const aquaponicWaterMakeupShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaponics", "agriculture"],
      keywords: ["aquaponics", "agriculture"],
    },
    id: "aquaponics/aquaponic-water-makeup-share",
    title: "Aquaponic Water Makeup Share",
    description:
      "Normalize explicit makeup-water volume to compatible total input water without estimating system water demand.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        makeupWaterVolume: { type: "number", minimum: 0 },
        totalInputWaterVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["makeupWaterVolume", "totalInputWaterVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "makeupWaterVolume",
          label: "Makeup Water Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalInputWaterVolume",
          label: "Total Input Water Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = aquaponicWaterMakeupShareTool.execute;
export default aquaponicWaterMakeupShareTool;
