import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ptoRevolutionsPerMinute: number;
  readonly engineRevolutionsPerMinute: number;
};
export type Output = { readonly ptoPerEngineRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ptoRevolutionsPerMinute: { type: "number", minimum: 0 },
    engineRevolutionsPerMinute: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["ptoRevolutionsPerMinute", "engineRevolutionsPerMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ptoPerEngineRatio: { type: "number" } },
  required: ["ptoPerEngineRatio"],
} as const;
/** Normalize explicit PTO rotational speed to engine speed on the same time basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ptoRevolutionsPerMinute, engineRevolutionsPerMinute } = request;
  const compute = (): Output => {
    H.domain(ptoRevolutionsPerMinute >= 0, "ptoRevolutionsPerMinute");
    (H.domain(engineRevolutionsPerMinute > 0, "engineRevolutionsPerMinute"),
      engineRevolutionsPerMinute);
    return {
      ptoPerEngineRatio: ptoRevolutionsPerMinute / engineRevolutionsPerMinute,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ptoRevolutionsPerMinute: 540, engineRevolutionsPerMinute: 1800 },
  output: { ptoPerEngineRatio: 0.3 },
} satisfies ToolExample<Input, Output>;
export const tractorPtoSpeedRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrotechnology", "agriculture"],
      keywords: ["agrotechnology", "agriculture"],
    },
    id: "agrotechnology/tractor-pto-speed-ratio",
    title: "Tractor PTO Speed Ratio",
    description:
      "Normalize explicit PTO rotational speed to engine speed on the same time basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ptoRevolutionsPerMinute: { type: "number", minimum: 0 },
        engineRevolutionsPerMinute: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["ptoRevolutionsPerMinute", "engineRevolutionsPerMinute"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ptoPerEngineRatio: { type: "number" } },
      required: ["ptoPerEngineRatio"],
    },
    ports: {
      inputs: [
        {
          id: "ptoRevolutionsPerMinute",
          label: "Pto Revolutions Per Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "engineRevolutionsPerMinute",
          label: "Engine Revolutions Per Minute",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ptoPerEngineRatio",
          label: "Pto Per Engine Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tractorPtoSpeedRatioTool.execute;
export default tractorPtoSpeedRatioTool;
