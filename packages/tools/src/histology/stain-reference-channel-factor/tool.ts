import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signal: number;
  readonly referenceChannel: number;
  readonly suppliedReferenceLevel: number;
  readonly blank: number;
};
export type Output = { readonly normalized: number; readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    referenceChannel: { type: "number", exclusiveMinimum: 0 },
    suppliedReferenceLevel: { type: "number", minimum: 0 },
    blank: { type: "number" },
  },
  required: ["signal", "referenceChannel", "suppliedReferenceLevel", "blank"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalized: { type: "number" }, factor: { type: "number" } },
  required: ["normalized", "factor"],
} as const;
/** Signed image-channel normalization with explicit reference values, not stain classification or laboratory instructions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, referenceChannel, suppliedReferenceLevel, blank } = request;
  const compute = (): Output => {
    H.positive(referenceChannel);
    H.domain(suppliedReferenceLevel >= 0);
    return {
      normalized:
        ((signal - blank) * suppliedReferenceLevel) / referenceChannel,
      factor: suppliedReferenceLevel / referenceChannel,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    signal: 12,
    referenceChannel: 4,
    suppliedReferenceLevel: 2,
    blank: 2,
  },
  output: { normalized: 5, factor: 0.5 },
} satisfies ToolExample<Input, Output>;
export const stainReferenceChannelFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/stain-reference-channel-factor",
    title: "Stain Reference Channel Factor Tool",
    description:
      "Signed image-channel normalization with explicit reference values, not stain classification or laboratory instructions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signal: { type: "number" },
        referenceChannel: { type: "number", exclusiveMinimum: 0 },
        suppliedReferenceLevel: { type: "number", minimum: 0 },
        blank: { type: "number" },
      },
      required: [
        "signal",
        "referenceChannel",
        "suppliedReferenceLevel",
        "blank",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalized: { type: "number" },
        factor: { type: "number" },
      },
      required: ["normalized", "factor"],
    },
    ports: {
      inputs: [
        {
          id: "signal",
          label: "Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceChannel",
          label: "Reference Channel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceLevel",
          label: "Supplied Reference Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blank",
          label: "Blank",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalized",
          label: "Normalized",
          valueType: { type: "number" },
        },
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stainReferenceChannelFactorTool.execute;
export default stainReferenceChannelFactorTool;
