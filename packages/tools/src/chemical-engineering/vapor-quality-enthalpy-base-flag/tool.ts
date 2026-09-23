import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quality: number;
  readonly liquidEnthalpy: number;
  readonly vaporEnthalpy: number;
  readonly referenceOffset: number;
  readonly includeOffset: boolean;
};
export type Output = { readonly mixtureEnthalpy: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quality: { type: "number", minimum: 0, maximum: 1 },
    liquidEnthalpy: { type: "number" },
    vaporEnthalpy: { type: "number" },
    referenceOffset: { type: "number" },
    includeOffset: { type: "boolean" },
  },
  required: [
    "quality",
    "liquidEnthalpy",
    "vaporEnthalpy",
    "referenceOffset",
    "includeOffset",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mixtureEnthalpy: { type: "number" } },
  required: ["mixtureEnthalpy"],
} as const;
/** Mass-quality lever rule for supplied same-state liquid/vapor enthalpies and an explicit reference offset. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    quality,
    liquidEnthalpy,
    vaporEnthalpy,
    referenceOffset,
    includeOffset,
  } = request;
  const compute = (): Output => {
    H.probability(quality);
    return {
      mixtureEnthalpy:
        liquidEnthalpy +
        quality * (vaporEnthalpy - liquidEnthalpy) +
        (includeOffset ? referenceOffset : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    quality: 0.25,
    liquidEnthalpy: 100,
    vaporEnthalpy: 500,
    referenceOffset: 20,
    includeOffset: true,
  },
  output: { mixtureEnthalpy: 220 },
} satisfies ToolExample<Input, Output>;
export const vaporQualityEnthalpyBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/vapor-quality-enthalpy-base-flag",
    title: "Vapor Quality Enthalpy Base Flag Tool",
    description:
      "Mass-quality lever rule for supplied same-state liquid/vapor enthalpies and an explicit reference offset.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quality: { type: "number", minimum: 0, maximum: 1 },
        liquidEnthalpy: { type: "number" },
        vaporEnthalpy: { type: "number" },
        referenceOffset: { type: "number" },
        includeOffset: { type: "boolean" },
      },
      required: [
        "quality",
        "liquidEnthalpy",
        "vaporEnthalpy",
        "referenceOffset",
        "includeOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mixtureEnthalpy: { type: "number" } },
      required: ["mixtureEnthalpy"],
    },
    ports: {
      inputs: [
        {
          id: "quality",
          label: "Quality",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "liquidEnthalpy",
          label: "Liquid Enthalpy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "vaporEnthalpy",
          label: "Vapor Enthalpy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceOffset",
          label: "Reference Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeOffset",
          label: "Include Offset",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "mixtureEnthalpy",
          label: "Mixture Enthalpy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vaporQualityEnthalpyBaseFlagTool.execute;
export default vaporQualityEnthalpyBaseFlagTool;
