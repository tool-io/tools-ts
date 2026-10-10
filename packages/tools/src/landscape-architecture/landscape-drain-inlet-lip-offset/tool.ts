import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly finishedSurfaceElevation: number;
  readonly inletLipElevation: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finishedSurfaceElevation: { type: "number" },
    inletLipElevation: { type: "number" },
  },
  required: ["finishedSurfaceElevation", "inletLipElevation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit finished surface elevation from inlet-lip elevation on the same datum without judging drainage adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { finishedSurfaceElevation, inletLipElevation } = request;
  const compute = (): Output => {
    return { signedGap: inletLipElevation - finishedSurfaceElevation };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { finishedSurfaceElevation: 12, inletLipElevation: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const landscapeDrainInletLipOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "landscape-architecture",
        "landscape architecture",
        "arts and design",
      ],
      keywords: ["landscape architecture", "arts and design"],
    },
    id: "landscape-architecture/landscape-drain-inlet-lip-offset",
    title: "Landscape Drain Inlet Lip Offset",
    description:
      "Subtract explicit finished surface elevation from inlet-lip elevation on the same datum without judging drainage adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        finishedSurfaceElevation: { type: "number" },
        inletLipElevation: { type: "number" },
      },
      required: ["finishedSurfaceElevation", "inletLipElevation"],
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
          id: "finishedSurfaceElevation",
          label: "Finished Surface Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inletLipElevation",
          label: "Inlet Lip Elevation",
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
export const run = landscapeDrainInletLipOffsetTool.execute;
export default landscapeDrainInletLipOffsetTool;
