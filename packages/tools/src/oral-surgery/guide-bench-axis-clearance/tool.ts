import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly holeRadius: number;
  readonly shaftRadius: number;
  readonly eccentricity: number;
};
export type Output = {
  readonly minimumClearance: number;
  readonly interference: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    holeRadius: { type: "number", minimum: 0 },
    shaftRadius: { type: "number", minimum: 0 },
    eccentricity: { type: "number", minimum: 0 },
  },
  required: ["holeRadius", "shaftRadius", "eccentricity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumClearance: { type: "number" },
    interference: { type: "boolean" },
  },
  required: ["minimumClearance", "interference"],
} as const;
/** Nominal circular bench clearance with supplied eccentricity, without guide design or surgical suitability advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { holeRadius, shaftRadius, eccentricity } = request;
  const compute = (): Output => {
    H.domain(holeRadius >= 0 && shaftRadius >= 0 && eccentricity >= 0);
    return {
      minimumClearance: holeRadius - shaftRadius - eccentricity,
      interference: holeRadius - shaftRadius - eccentricity < 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { holeRadius: 5, shaftRadius: 3, eccentricity: 1 },
  output: { minimumClearance: 1, interference: false },
} satisfies ToolExample<Input, Output>;
export const guideBenchAxisClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oral-surgery/guide-bench-axis-clearance",
    title: "Guide Bench Axis Clearance Tool",
    description:
      "Nominal circular bench clearance with supplied eccentricity, without guide design or surgical suitability advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        holeRadius: { type: "number", minimum: 0 },
        shaftRadius: { type: "number", minimum: 0 },
        eccentricity: { type: "number", minimum: 0 },
      },
      required: ["holeRadius", "shaftRadius", "eccentricity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumClearance: { type: "number" },
        interference: { type: "boolean" },
      },
      required: ["minimumClearance", "interference"],
    },
    ports: {
      inputs: [
        {
          id: "holeRadius",
          label: "Hole Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shaftRadius",
          label: "Shaft Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eccentricity",
          label: "Eccentricity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "minimumClearance",
          label: "Minimum Clearance",
          valueType: { type: "number" },
        },
        {
          id: "interference",
          label: "Interference",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = guideBenchAxisClearanceTool.execute;
export default guideBenchAxisClearanceTool;
