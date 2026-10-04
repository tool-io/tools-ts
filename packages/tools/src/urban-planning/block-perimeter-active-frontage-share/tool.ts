import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly perimeter: number;
  readonly excludedFrontage: number;
  readonly activeFrontage: number;
};
export type Output = {
  readonly eligibleFrontage: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perimeter: { type: "number" },
    excludedFrontage: { type: "number", minimum: 0 },
    activeFrontage: { type: "number", minimum: 0 },
  },
  required: ["perimeter", "excludedFrontage", "activeFrontage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleFrontage: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["eligibleFrontage", "fraction"],
} as const;
/** Calculate block perimeter active frontage share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { perimeter, excludedFrontage, activeFrontage } = request;
  const compute = (): Output => {
    H.domain(
      excludedFrontage >= 0 &&
        perimeter > excludedFrontage &&
        activeFrontage >= 0 &&
        activeFrontage <= perimeter - excludedFrontage,
    );
    return {
      eligibleFrontage: perimeter - excludedFrontage,
      fraction: activeFrontage / (perimeter - excludedFrontage),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { perimeter: 400, excludedFrontage: 40, activeFrontage: 180 },
  output: { eligibleFrontage: 360, fraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const blockPerimeterActiveFrontageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/block-perimeter-active-frontage-share",
    title: "Block Perimeter Active Frontage Share Tool",
    description:
      "Calculate block perimeter active frontage share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        perimeter: { type: "number" },
        excludedFrontage: { type: "number", minimum: 0 },
        activeFrontage: { type: "number", minimum: 0 },
      },
      required: ["perimeter", "excludedFrontage", "activeFrontage"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleFrontage: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["eligibleFrontage", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "perimeter",
          label: "Perimeter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedFrontage",
          label: "Excluded Frontage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "activeFrontage",
          label: "Active Frontage",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleFrontage",
          label: "Eligible Frontage",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = blockPerimeterActiveFrontageShareTool.execute;
export default blockPerimeterActiveFrontageShareTool;
