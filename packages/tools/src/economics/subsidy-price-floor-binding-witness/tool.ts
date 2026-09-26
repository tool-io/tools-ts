import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly marketPrice: number;
  readonly suppliedFloor: number;
  readonly perUnitSubsidy: number;
};
export type Output = {
  readonly effectivePrice: number;
  readonly binds: boolean;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marketPrice: { type: "number", minimum: 0 },
    suppliedFloor: { type: "number", minimum: 0 },
    perUnitSubsidy: { type: "number", minimum: 0 },
  },
  required: ["marketPrice", "suppliedFloor", "perUnitSubsidy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectivePrice: { type: "number" },
    binds: { type: "boolean" },
    gap: { type: "number" },
  },
  required: ["effectivePrice", "binds", "gap"],
} as const;
/** Calculate subsidy price floor binding witness from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { marketPrice, suppliedFloor, perUnitSubsidy } = request;
  const compute = (): Output => {
    H.domain(marketPrice >= 0 && suppliedFloor >= 0 && perUnitSubsidy >= 0);
    return {
      effectivePrice: marketPrice + perUnitSubsidy,
      binds: marketPrice + perUnitSubsidy < suppliedFloor,
      gap: Math.max(0, suppliedFloor - marketPrice - perUnitSubsidy),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { marketPrice: 8, suppliedFloor: 12, perUnitSubsidy: 2 },
  output: { effectivePrice: 10, binds: true, gap: 2 },
} satisfies ToolExample<Input, Output>;
export const subsidyPriceFloorBindingWitnessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/subsidy-price-floor-binding-witness",
    title: "Subsidy Price Floor Binding Witness Tool",
    description:
      "Calculate subsidy price floor binding witness from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marketPrice: { type: "number", minimum: 0 },
        suppliedFloor: { type: "number", minimum: 0 },
        perUnitSubsidy: { type: "number", minimum: 0 },
      },
      required: ["marketPrice", "suppliedFloor", "perUnitSubsidy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectivePrice: { type: "number" },
        binds: { type: "boolean" },
        gap: { type: "number" },
      },
      required: ["effectivePrice", "binds", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "marketPrice",
          label: "Market Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFloor",
          label: "Supplied Floor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "perUnitSubsidy",
          label: "Per Unit Subsidy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectivePrice",
          label: "Effective Price",
          valueType: { type: "number" },
        },
        { id: "binds", label: "Binds", valueType: { type: "boolean" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = subsidyPriceFloorBindingWitnessTool.execute;
export default subsidyPriceFloorBindingWitnessTool;
