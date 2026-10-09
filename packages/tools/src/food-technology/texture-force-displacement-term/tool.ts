import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedMeanForceNewtons: number;
  readonly displacementMeters: number;
};
export type Output = { readonly workJoules: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedMeanForceNewtons: { type: "number" },
    displacementMeters: { type: "number" },
  },
  required: ["suppliedMeanForceNewtons", "displacementMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { workJoules: { type: "number" } },
  required: ["workJoules"],
} as const;
/** Multiply explicit mean force by signed displacement on the same axis without estimating a full texture-test integral. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedMeanForceNewtons, displacementMeters } = request;
  const compute = (): Output => {
    return { workJoules: suppliedMeanForceNewtons * displacementMeters };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedMeanForceNewtons: 12, displacementMeters: 0.02 },
  output: { workJoules: 0.24 },
} satisfies ToolExample<Input, Output>;
export const textureForceDisplacementTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "food-technology",
        "food technology",
        "research and quality management",
      ],
      keywords: ["food technology", "research and quality management"],
    },
    id: "food-technology/texture-force-displacement-term",
    title: "Texture Force Displacement Term",
    description:
      "Multiply explicit mean force by signed displacement on the same axis without estimating a full texture-test integral.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedMeanForceNewtons: { type: "number" },
        displacementMeters: { type: "number" },
      },
      required: ["suppliedMeanForceNewtons", "displacementMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { workJoules: { type: "number" } },
      required: ["workJoules"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedMeanForceNewtons",
          label: "Supplied Mean Force Newtons",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "displacementMeters",
          label: "Displacement Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "workJoules",
          label: "Work Joules",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = textureForceDisplacementTermTool.execute;
export default textureForceDisplacementTermTool;
