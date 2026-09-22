import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalFlow: number;
  readonly plantFraction: number;
  readonly bypassFraction: number;
};
export type Output = {
  readonly plantFlow: number;
  readonly bypassFlow: number;
  readonly remainingFlow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalFlow: { type: "number", minimum: 0 },
    plantFraction: { type: "number", minimum: 0 },
    bypassFraction: { type: "number", minimum: 0 },
  },
  required: ["totalFlow", "plantFraction", "bypassFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plantFlow: { type: "number" },
    bypassFlow: { type: "number" },
    remainingFlow: { type: "number" },
  },
  required: ["plantFlow", "bypassFlow", "remainingFlow"],
} as const;
/** Calculate fish plant loop flow split term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalFlow, plantFraction, bypassFraction } = request;
  const compute = (): Output => {
    H.domain(
      totalFlow >= 0 &&
        plantFraction >= 0 &&
        bypassFraction >= 0 &&
        plantFraction + bypassFraction <= 1,
    );
    return {
      plantFlow: totalFlow * plantFraction,
      bypassFlow: totalFlow * bypassFraction,
      remainingFlow: totalFlow * (1 - plantFraction - bypassFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalFlow: 100, plantFraction: 0.6, bypassFraction: 0.1 },
  output: { plantFlow: 60, bypassFlow: 10, remainingFlow: 30.000000000000004 },
} satisfies ToolExample<Input, Output>;
export const fishPlantLoopFlowSplitTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/fish-plant-loop-flow-split-term",
    title: "Fish Plant Loop Flow Split Term Tool",
    description:
      "Calculate fish plant loop flow split term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalFlow: { type: "number", minimum: 0 },
        plantFraction: { type: "number", minimum: 0 },
        bypassFraction: { type: "number", minimum: 0 },
      },
      required: ["totalFlow", "plantFraction", "bypassFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plantFlow: { type: "number" },
        bypassFlow: { type: "number" },
        remainingFlow: { type: "number" },
      },
      required: ["plantFlow", "bypassFlow", "remainingFlow"],
    },
    ports: {
      inputs: [
        {
          id: "totalFlow",
          label: "Total Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plantFraction",
          label: "Plant Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "bypassFraction",
          label: "Bypass Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        { id: "plantFlow", label: "Plant Flow", valueType: { type: "number" } },
        {
          id: "bypassFlow",
          label: "Bypass Flow",
          valueType: { type: "number" },
        },
        {
          id: "remainingFlow",
          label: "Remaining Flow",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fishPlantLoopFlowSplitTermTool.execute;
export default fishPlantLoopFlowSplitTermTool;
