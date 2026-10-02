import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly suppliedDepth: number;
  readonly effectiveRain: number;
  readonly storedCredit: number;
};
export type Output = { readonly netVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    suppliedDepth: { type: "number", minimum: 0 },
    effectiveRain: { type: "number", minimum: 0 },
    storedCredit: { type: "number", minimum: 0 },
  },
  required: ["area", "suppliedDepth", "effectiveRain", "storedCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netVolume: { type: "number" } },
  required: ["netVolume"],
} as const;
/** Budget against caller-supplied water-depth observations, without crop requirement lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, suppliedDepth, effectiveRain, storedCredit } = request;
  const compute = (): Output => {
    H.domain(
      area >= 0 &&
        suppliedDepth >= 0 &&
        effectiveRain >= 0 &&
        storedCredit >= 0,
    );
    return {
      netVolume: Math.max(
        0,
        area * (suppliedDepth - effectiveRain) - storedCredit,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { area: 10, suppliedDepth: 20, effectiveRain: 5, storedCredit: 30 },
  output: { netVolume: 120 },
} satisfies ToolExample<Input, Output>;
export const perennialGardenWaterBudgetOneCropTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/perennial-garden-water-budget-one-crop",
    title: "Perennial Garden Water Budget One Crop Tool",
    description:
      "Budget against caller-supplied water-depth observations, without crop requirement lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        suppliedDepth: { type: "number", minimum: 0 },
        effectiveRain: { type: "number", minimum: 0 },
        storedCredit: { type: "number", minimum: 0 },
      },
      required: ["area", "suppliedDepth", "effectiveRain", "storedCredit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netVolume: { type: "number" } },
      required: ["netVolume"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDepth",
          label: "Supplied Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "effectiveRain",
          label: "Effective Rain",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "storedCredit",
          label: "Stored Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netVolume", label: "Net Volume", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = perennialGardenWaterBudgetOneCropTool.execute;
export default perennialGardenWaterBudgetOneCropTool;
