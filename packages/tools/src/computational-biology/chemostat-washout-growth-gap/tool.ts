import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly maxGrowth: number;
  readonly substrate: number;
  readonly halfSaturation: number;
  readonly dilution: number;
};
export type Output = {
  readonly specificGrowth: number;
  readonly netGrowth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maxGrowth: { type: "number", minimum: 0 },
    substrate: { type: "number", minimum: 0 },
    halfSaturation: { type: "number", exclusiveMinimum: 0 },
    dilution: { type: "number", minimum: 0 },
  },
  required: ["maxGrowth", "substrate", "halfSaturation", "dilution"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specificGrowth: { type: "number" },
    netGrowth: { type: "number" },
  },
  required: ["specificGrowth", "netGrowth"],
} as const;
/** Local Monod growth-minus-dilution term, without solving substrate balance or predicting stable operation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { maxGrowth, substrate, halfSaturation, dilution } = request;
  const compute = (): Output => {
    H.domain(maxGrowth >= 0 && substrate >= 0 && dilution >= 0);
    H.positive(halfSaturation);
    return {
      specificGrowth: (maxGrowth * substrate) / (halfSaturation + substrate),
      netGrowth:
        (maxGrowth * substrate) / (halfSaturation + substrate) - dilution,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { maxGrowth: 1, substrate: 3, halfSaturation: 1, dilution: 0.5 },
  output: { specificGrowth: 0.75, netGrowth: 0.25 },
} satisfies ToolExample<Input, Output>;
export const chemostatWashoutGrowthGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/chemostat-washout-growth-gap",
    title: "Chemostat Washout Growth Gap Tool",
    description:
      "Local Monod growth-minus-dilution term, without solving substrate balance or predicting stable operation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        maxGrowth: { type: "number", minimum: 0 },
        substrate: { type: "number", minimum: 0 },
        halfSaturation: { type: "number", exclusiveMinimum: 0 },
        dilution: { type: "number", minimum: 0 },
      },
      required: ["maxGrowth", "substrate", "halfSaturation", "dilution"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specificGrowth: { type: "number" },
        netGrowth: { type: "number" },
      },
      required: ["specificGrowth", "netGrowth"],
    },
    ports: {
      inputs: [
        {
          id: "maxGrowth",
          label: "Max Growth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "substrate",
          label: "Substrate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "halfSaturation",
          label: "Half Saturation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dilution",
          label: "Dilution",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "specificGrowth",
          label: "Specific Growth",
          valueType: { type: "number" },
        },
        { id: "netGrowth", label: "Net Growth", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = chemostatWashoutGrowthGapTool.execute;
export default chemostatWashoutGrowthGapTool;
