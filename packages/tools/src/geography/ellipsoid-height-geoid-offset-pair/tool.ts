import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ellipsoidHeight: number;
  readonly geoidUndulation: number;
};
export type Output = { readonly orthometricHeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ellipsoidHeight: { type: "number" },
    geoidUndulation: { type: "number" },
  },
  required: ["ellipsoidHeight", "geoidUndulation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { orthometricHeight: { type: "number" } },
  required: ["orthometricHeight"],
} as const;
/** Apply the explicit height relation H=h-N using compatible ellipsoidal height and geoid undulation without retrieving a geoid model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ellipsoidHeight, geoidUndulation } = request;
  const compute = (): Output => {
    return { orthometricHeight: ellipsoidHeight - geoidUndulation };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ellipsoidHeight: 120, geoidUndulation: 30 },
  output: { orthometricHeight: 90 },
} satisfies ToolExample<Input, Output>;
export const ellipsoidHeightGeoidOffsetPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geography", "earth and environmental sciences"],
      keywords: ["geography", "earth and environmental sciences"],
    },
    id: "geography/ellipsoid-height-geoid-offset-pair",
    title: "Ellipsoid Height Geoid Offset Pair",
    description:
      "Apply the explicit height relation H=h-N using compatible ellipsoidal height and geoid undulation without retrieving a geoid model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ellipsoidHeight: { type: "number" },
        geoidUndulation: { type: "number" },
      },
      required: ["ellipsoidHeight", "geoidUndulation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { orthometricHeight: { type: "number" } },
      required: ["orthometricHeight"],
    },
    ports: {
      inputs: [
        {
          id: "ellipsoidHeight",
          label: "Ellipsoid Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "geoidUndulation",
          label: "Geoid Undulation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "orthometricHeight",
          label: "Orthometric Height",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ellipsoidHeightGeoidOffsetPairTool.execute;
export default ellipsoidHeightGeoidOffsetPairTool;
