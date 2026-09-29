import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredLength: number;
  readonly tailComplete: boolean;
  readonly suppliedMissingLength: number;
  readonly correctionKnown: boolean;
};
export type Output = {
  readonly lengthDefined: boolean;
  readonly adjustedLength: number;
  readonly truncated: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredLength: { type: "number", minimum: 0 },
    tailComplete: { type: "boolean" },
    suppliedMissingLength: { type: "number", minimum: 0 },
    correctionKnown: { type: "boolean" },
  },
  required: [
    "measuredLength",
    "tailComplete",
    "suppliedMissingLength",
    "correctionKnown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengthDefined: { type: "boolean" },
    adjustedLength: { type: "number" },
    truncated: { type: "boolean" },
  },
  required: ["lengthDefined", "adjustedLength", "truncated"],
} as const;
/** Retain an observed tail-completeness flag and only an independently supplied correction; no fish growth inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    measuredLength,
    tailComplete,
    suppliedMissingLength,
    correctionKnown,
  } = request;
  const compute = (): Output => {
    H.domain(measuredLength >= 0 && suppliedMissingLength >= 0);
    const lengthDefined = tailComplete || correctionKnown;
    return {
      lengthDefined,
      adjustedLength: lengthDefined
        ? measuredLength + (tailComplete ? 0 : suppliedMissingLength)
        : 0,
      truncated: !tailComplete,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredLength: 10,
    tailComplete: false,
    suppliedMissingLength: 2,
    correctionKnown: true,
  },
  output: { lengthDefined: true, adjustedLength: 12, truncated: true },
} satisfies ToolExample<Input, Output>;
export const fishLengthTruncatedTailFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-length-truncated-tail-flag",
    title: "Fish Length Truncated Tail Flag Tool",
    description:
      "Retain an observed tail-completeness flag and only an independently supplied correction; no fish growth inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredLength: { type: "number", minimum: 0 },
        tailComplete: { type: "boolean" },
        suppliedMissingLength: { type: "number", minimum: 0 },
        correctionKnown: { type: "boolean" },
      },
      required: [
        "measuredLength",
        "tailComplete",
        "suppliedMissingLength",
        "correctionKnown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lengthDefined: { type: "boolean" },
        adjustedLength: { type: "number" },
        truncated: { type: "boolean" },
      },
      required: ["lengthDefined", "adjustedLength", "truncated"],
    },
    ports: {
      inputs: [
        {
          id: "measuredLength",
          label: "Measured Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tailComplete",
          label: "Tail Complete",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedMissingLength",
          label: "Supplied Missing Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "correctionKnown",
          label: "Correction Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "lengthDefined",
          label: "Length Defined",
          valueType: { type: "boolean" },
        },
        {
          id: "adjustedLength",
          label: "Adjusted Length",
          valueType: { type: "number" },
        },
        { id: "truncated", label: "Truncated", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = fishLengthTruncatedTailFlagTool.execute;
export default fishLengthTruncatedTailFlagTool;
