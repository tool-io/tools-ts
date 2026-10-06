import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referencePlaneHeight: number;
  readonly measuredHeight: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referencePlaneHeight: { type: "number" },
    measuredHeight: { type: "number" },
  },
  required: ["referencePlaneHeight", "measuredHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit reference-plane height from a measured seedbed height without estimating a roughness statistic. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referencePlaneHeight, measuredHeight } = request;
  const compute = (): Output => {
    return { signedGap: measuredHeight - referencePlaneHeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referencePlaneHeight: 12, measuredHeight: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const seedbedRoughnessReferenceplaneOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["agrophysics", "agriculture"],
        keywords: ["agrophysics", "agriculture"],
      },
      id: "agrophysics/seedbed-roughness-reference-plane-offset",
      title: "Seedbed Roughness Reference Plane Offset",
      description:
        "Subtract an explicit reference-plane height from a measured seedbed height without estimating a roughness statistic.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referencePlaneHeight: { type: "number" },
          measuredHeight: { type: "number" },
        },
        required: ["referencePlaneHeight", "measuredHeight"],
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
            id: "referencePlaneHeight",
            label: "Reference Plane Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "measuredHeight",
            label: "Measured Height",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = seedbedRoughnessReferenceplaneOffsetTool.execute;
export default seedbedRoughnessReferenceplaneOffsetTool;
