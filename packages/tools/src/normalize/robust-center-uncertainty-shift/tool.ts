import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly suppliedCenter: number;
  readonly suppliedScale: number;
  readonly centerUncertainty: number;
};
export type Output = {
  readonly normalized: number;
  readonly lower: number;
  readonly upper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    suppliedCenter: { type: "number" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
    centerUncertainty: { type: "number", minimum: 0 },
  },
  required: ["value", "suppliedCenter", "suppliedScale", "centerUncertainty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalized: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["normalized", "lower", "upper"],
} as const;
/** Propagate an explicit bounded center uncertainty through a supplied positive-scale normalization without estimating robust center or scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, suppliedCenter, suppliedScale, centerUncertainty } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(suppliedScale) && suppliedScale > 0,
      "suppliedScale",
    ),
      suppliedScale);
    H.domain(centerUncertainty >= 0, "centerUncertainty");
    return {
      normalized: (value - suppliedCenter) / suppliedScale,
      lower: (value - suppliedCenter - centerUncertainty) / suppliedScale,
      upper: (value - suppliedCenter + centerUncertainty) / suppliedScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    value: 10,
    suppliedCenter: 4,
    suppliedScale: 2,
    centerUncertainty: 1,
  },
  output: { normalized: 3, lower: 2.5, upper: 3.5 },
} satisfies ToolExample<Input, Output>;
export const robustCenterUncertaintyShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["normalize", "data normalization", "computer science"],
      keywords: ["data normalization", "computer science"],
    },
    id: "normalize/robust-center-uncertainty-shift",
    title: "Robust Center Uncertainty Shift",
    description:
      "Propagate an explicit bounded center uncertainty through a supplied positive-scale normalization without estimating robust center or scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        suppliedCenter: { type: "number" },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
        centerUncertainty: { type: "number", minimum: 0 },
      },
      required: [
        "value",
        "suppliedCenter",
        "suppliedScale",
        "centerUncertainty",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalized: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
      },
      required: ["normalized", "lower", "upper"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCenter",
          label: "Supplied Center",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "centerUncertainty",
          label: "Center Uncertainty",
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
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = robustCenterUncertaintyShiftTool.execute;
export default robustCenterUncertaintyShiftTool;
