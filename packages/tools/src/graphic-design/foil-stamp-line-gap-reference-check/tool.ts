import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredGap: number;
  readonly suppliedMinimumGap: number;
};
export type Output = {
  readonly gapMargin: number;
  readonly meetsSuppliedMinimum: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredGap: { type: "number", minimum: 0 },
    suppliedMinimumGap: { type: "number", minimum: 0 },
  },
  required: ["measuredGap", "suppliedMinimumGap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapMargin: { type: "number" },
    meetsSuppliedMinimum: { type: "boolean" },
  },
  required: ["gapMargin", "meetsSuppliedMinimum"],
} as const;
/** Compare explicit foil-stamp line gap with a supplied inclusive minimum in matching units without selecting printer specifications. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredGap, suppliedMinimumGap } = request;
  const compute = (): Output => {
    H.domain(measuredGap >= 0, "measuredGap");
    H.domain(suppliedMinimumGap >= 0, "suppliedMinimumGap");
    return {
      gapMargin: measuredGap - suppliedMinimumGap,
      meetsSuppliedMinimum: measuredGap >= suppliedMinimumGap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredGap: 0.4, suppliedMinimumGap: 0.3 },
  output: { gapMargin: 0.10000000000000003, meetsSuppliedMinimum: true },
} satisfies ToolExample<Input, Output>;
export const foilStampLineGapReferenceCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/foil-stamp-line-gap-reference-check",
    title: "Foil Stamp Line Gap Reference Check Tool",
    description:
      "Compare explicit foil-stamp line gap with a supplied inclusive minimum in matching units without selecting printer specifications.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredGap: { type: "number", minimum: 0 },
        suppliedMinimumGap: { type: "number", minimum: 0 },
      },
      required: ["measuredGap", "suppliedMinimumGap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapMargin: { type: "number" },
        meetsSuppliedMinimum: { type: "boolean" },
      },
      required: ["gapMargin", "meetsSuppliedMinimum"],
    },
    ports: {
      inputs: [
        {
          id: "measuredGap",
          label: "Measured Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedMinimumGap",
          label: "Supplied Minimum Gap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gapMargin", label: "Gap Margin", valueType: { type: "number" } },
        {
          id: "meetsSuppliedMinimum",
          label: "Meets Supplied Minimum",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = foilStampLineGapReferenceCheckTool.execute;
export default foilStampLineGapReferenceCheckTool;
