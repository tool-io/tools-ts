import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly carriedLiquidVolume: number;
  readonly suppliedSaltConcentration: number;
};
export type Output = { readonly carriedSaltAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    carriedLiquidVolume: { type: "number", minimum: 0 },
    suppliedSaltConcentration: { type: "number", minimum: 0 },
  },
  required: ["carriedLiquidVolume", "suppliedSaltConcentration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { carriedSaltAmount: { type: "number" } },
  required: ["carriedSaltAmount"],
} as const;
/** Multiply explicit carried-liquid volume by compatible supplied salt concentration as a mass-balance term without designing purification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { carriedLiquidVolume, suppliedSaltConcentration } = request;
  const compute = (): Output => {
    H.domain(
      carriedLiquidVolume >= 0 && suppliedSaltConcentration >= 0,
      "carriedLiquidVolume",
    );
    return {
      carriedSaltAmount: carriedLiquidVolume * suppliedSaltConcentration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { carriedLiquidVolume: 2, suppliedSaltConcentration: 0.5 },
  output: { carriedSaltAmount: 1 },
} satisfies ToolExample<Input, Output>;
export const purificationPoolSaltCarryVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biotechnology", "biology"],
      keywords: ["biotechnology", "biology"],
    },
    id: "biotechnology/purification-pool-salt-carry-volume",
    title: "Purification Pool Salt Carry Volume",
    description:
      "Multiply explicit carried-liquid volume by compatible supplied salt concentration as a mass-balance term without designing purification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        carriedLiquidVolume: { type: "number", minimum: 0 },
        suppliedSaltConcentration: { type: "number", minimum: 0 },
      },
      required: ["carriedLiquidVolume", "suppliedSaltConcentration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { carriedSaltAmount: { type: "number" } },
      required: ["carriedSaltAmount"],
    },
    ports: {
      inputs: [
        {
          id: "carriedLiquidVolume",
          label: "Carried Liquid Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSaltConcentration",
          label: "Supplied Salt Concentration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "carriedSaltAmount",
          label: "Carried Salt Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = purificationPoolSaltCarryVolumeTool.execute;
export default purificationPoolSaltCarryVolumeTool;
