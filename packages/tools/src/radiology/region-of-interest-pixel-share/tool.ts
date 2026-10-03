import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regionPixels: number;
  readonly includedPixels: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regionPixels: { type: "integer", minimum: 0 },
    includedPixels: { type: "integer", minimum: 0 },
  },
  required: ["regionPixels", "includedPixels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate region of interest pixel share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regionPixels, includedPixels } = request;
  const compute = (): Output => {
    H.integer(includedPixels, 0);
    H.integer(regionPixels, 0, includedPixels);
    return {
      share: includedPixels > 0 ? regionPixels / includedPixels : 0,
      defined: includedPixels > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { regionPixels: 20, includedPixels: 100 },
  output: { share: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const regionOfInterestPixelShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/region-of-interest-pixel-share",
    title: "Region Of Interest Pixel Share Tool",
    description:
      "Calculate region of interest pixel share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regionPixels: { type: "integer", minimum: 0 },
        includedPixels: { type: "integer", minimum: 0 },
      },
      required: ["regionPixels", "includedPixels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "regionPixels",
          label: "Region Pixels",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includedPixels",
          label: "Included Pixels",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = regionOfInterestPixelShareTool.execute;
export default regionOfInterestPixelShareTool;
