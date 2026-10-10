import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredPixels: number;
  readonly discPixels: number;
};
export type Output = { readonly discDiameterUnits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredPixels: { type: "number", minimum: 0 },
    discPixels: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredPixels", "discPixels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { discDiameterUnits: { type: "number" } },
  required: ["discDiameterUnits"],
} as const;
/** Express a supplied retinal image distance in explicitly measured disc-diameter units without anatomical size calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredPixels, discPixels } = request;
  const compute = (): Output => {
    H.domain(measuredPixels >= 0, "measuredPixels");
    (H.domain(discPixels > 0, "discPixels"), discPixels);
    return { discDiameterUnits: measuredPixels / discPixels };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredPixels: 300, discPixels: 120 },
  output: { discDiameterUnits: 2.5 },
} satisfies ToolExample<Input, Output>;
export const retinaDiscDiameterScaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["ophthalmology", "health and medicine"],
      keywords: ["ophthalmology", "health and medicine"],
    },
    id: "ophthalmology/retina-disc-diameter-scale",
    title: "Retina Disc Diameter Scale",
    description:
      "Express a supplied retinal image distance in explicitly measured disc-diameter units without anatomical size calibration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredPixels: { type: "number", minimum: 0 },
        discPixels: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredPixels", "discPixels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { discDiameterUnits: { type: "number" } },
      required: ["discDiameterUnits"],
    },
    ports: {
      inputs: [
        {
          id: "measuredPixels",
          label: "Measured Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discPixels",
          label: "Disc Pixels",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "discDiameterUnits",
          label: "Disc Diameter Units",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = retinaDiscDiameterScaleTool.execute;
export default retinaDiscDiameterScaleTool;
