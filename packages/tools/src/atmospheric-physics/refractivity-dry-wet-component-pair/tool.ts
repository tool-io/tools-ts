import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryRefractivity: number;
  readonly wetRefractivity: number;
};
export type Output = {
  readonly totalRefractivity: number;
  readonly wetFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryRefractivity: { type: "number", minimum: 0 },
    wetRefractivity: { type: "number", minimum: 0 },
  },
  required: ["dryRefractivity", "wetRefractivity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalRefractivity: { type: "number" },
    wetFraction: { type: "number" },
  },
  required: ["totalRefractivity", "wetFraction"],
} as const;
/** Combine explicitly supplied nonnegative dry and wet refractivity components and describe the wet share. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryRefractivity, wetRefractivity } = request;
  const compute = (): Output => {
    H.domain(
      dryRefractivity >= 0 &&
        wetRefractivity >= 0 &&
        dryRefractivity + wetRefractivity > 0,
      "dryRefractivity",
    );
    return {
      totalRefractivity: dryRefractivity + wetRefractivity,
      wetFraction: wetRefractivity / (dryRefractivity + wetRefractivity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dryRefractivity: 250, wetRefractivity: 50 },
  output: { totalRefractivity: 300, wetFraction: 0.16666666666666666 },
} satisfies ToolExample<Input, Output>;
export const refractivityDrywetComponentPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-physics", "atmospheric physics", "physics"],
      keywords: ["atmospheric physics", "physics"],
    },
    id: "atmospheric-physics/refractivity-dry-wet-component-pair",
    title: "Refractivity Dry Wet Component Pair",
    description:
      "Combine explicitly supplied nonnegative dry and wet refractivity components and describe the wet share.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryRefractivity: { type: "number", minimum: 0 },
        wetRefractivity: { type: "number", minimum: 0 },
      },
      required: ["dryRefractivity", "wetRefractivity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalRefractivity: { type: "number" },
        wetFraction: { type: "number" },
      },
      required: ["totalRefractivity", "wetFraction"],
    },
    ports: {
      inputs: [
        {
          id: "dryRefractivity",
          label: "Dry Refractivity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wetRefractivity",
          label: "Wet Refractivity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalRefractivity",
          label: "Total Refractivity",
          valueType: { type: "number" },
        },
        {
          id: "wetFraction",
          label: "Wet Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = refractivityDrywetComponentPairTool.execute;
export default refractivityDrywetComponentPairTool;
