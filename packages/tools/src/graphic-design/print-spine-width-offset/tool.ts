import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseSpineWidth: number;
  readonly suppliedAdjustment: number;
};
export type Output = { readonly adjustedSpineWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseSpineWidth: { type: "number", minimum: 0 },
    suppliedAdjustment: { type: "number" },
  },
  required: ["baseSpineWidth", "suppliedAdjustment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { adjustedSpineWidth: { type: "number" } },
  required: ["adjustedSpineWidth"],
} as const;
/** Apply an explicit printer-supplied spine adjustment without inferring paper caliper or binding requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseSpineWidth, suppliedAdjustment } = request;
  const compute = (): Output => {
    H.domain(
      baseSpineWidth >= 0 && baseSpineWidth + suppliedAdjustment >= 0,
      "baseSpineWidth",
    );
    return { adjustedSpineWidth: baseSpineWidth + suppliedAdjustment };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseSpineWidth: 12, suppliedAdjustment: 0.5 },
  output: { adjustedSpineWidth: 12.5 },
} satisfies ToolExample<Input, Output>;
export const printSpineWidthOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["graphic-design", "graphic design", "arts and design"],
      keywords: ["graphic design", "arts and design"],
    },
    id: "graphic-design/print-spine-width-offset",
    title: "Print Spine Width Offset",
    description:
      "Apply an explicit printer-supplied spine adjustment without inferring paper caliper or binding requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseSpineWidth: { type: "number", minimum: 0 },
        suppliedAdjustment: { type: "number" },
      },
      required: ["baseSpineWidth", "suppliedAdjustment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { adjustedSpineWidth: { type: "number" } },
      required: ["adjustedSpineWidth"],
    },
    ports: {
      inputs: [
        {
          id: "baseSpineWidth",
          label: "Base Spine Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedAdjustment",
          label: "Supplied Adjustment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "adjustedSpineWidth",
          label: "Adjusted Spine Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = printSpineWidthOffsetTool.execute;
export default printSpineWidthOffsetTool;
