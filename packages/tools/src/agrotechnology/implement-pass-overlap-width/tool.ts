import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly implementWidth: number;
  readonly passSpacing: number;
  readonly suppliedSideOffset: number;
};
export type Output = {
  readonly effectiveSpacing: number;
  readonly overlapWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    implementWidth: { type: "number", minimum: 0 },
    passSpacing: { type: "number", minimum: 0 },
    suppliedSideOffset: { type: "number" },
  },
  required: ["implementWidth", "passSpacing", "suppliedSideOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveSpacing: { type: "number" },
    overlapWidth: { type: "number" },
  },
  required: ["effectiveSpacing", "overlapWidth"],
} as const;
/** Signed nominal supplied implement-pass overlap/gap without issuing machine guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { implementWidth, passSpacing, suppliedSideOffset } = request;
  const compute = (): Output => {
    H.domain(
      implementWidth >= 0 &&
        passSpacing >= 0 &&
        passSpacing + suppliedSideOffset >= 0,
    );
    return {
      effectiveSpacing: passSpacing + suppliedSideOffset,
      overlapWidth: implementWidth - passSpacing - suppliedSideOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { implementWidth: 10, passSpacing: 8, suppliedSideOffset: 1 },
  output: { effectiveSpacing: 9, overlapWidth: 1 },
} satisfies ToolExample<Input, Output>;
export const implementPassOverlapWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/implement-pass-overlap-width",
    title: "Implement Pass Overlap Width Tool",
    description:
      "Signed nominal supplied implement-pass overlap/gap without issuing machine guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        implementWidth: { type: "number", minimum: 0 },
        passSpacing: { type: "number", minimum: 0 },
        suppliedSideOffset: { type: "number" },
      },
      required: ["implementWidth", "passSpacing", "suppliedSideOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveSpacing: { type: "number" },
        overlapWidth: { type: "number" },
      },
      required: ["effectiveSpacing", "overlapWidth"],
    },
    ports: {
      inputs: [
        {
          id: "implementWidth",
          label: "Implement Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "passSpacing",
          label: "Pass Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSideOffset",
          label: "Supplied Side Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveSpacing",
          label: "Effective Spacing",
          valueType: { type: "number" },
        },
        {
          id: "overlapWidth",
          label: "Overlap Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = implementPassOverlapWidthTool.execute;
export default implementPassOverlapWidthTool;
