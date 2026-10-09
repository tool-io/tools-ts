import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly lengthMillimeters: number };
export type Output = {
  readonly lengthCentimeters: number;
  readonly lengthMeters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lengthMillimeters: { type: "number", minimum: 0 } },
  required: ["lengthMillimeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengthCentimeters: { type: "number" },
    lengthMeters: { type: "number" },
  },
  required: ["lengthCentimeters", "lengthMeters"],
} as const;
/** Convert a supplied nonnegative turtle plastron length from millimeters to centimeters and meters without determining age or size class. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lengthMillimeters } = request;
  const compute = (): Output => {
    H.domain(lengthMillimeters >= 0, "lengthMillimeters");
    return {
      lengthCentimeters: lengthMillimeters / 10,
      lengthMeters: lengthMillimeters / 1000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lengthMillimeters: 125 },
  output: { lengthCentimeters: 12.5, lengthMeters: 0.125 },
} satisfies ToolExample<Input, Output>;
export const turtlePlastronLengthUnitPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/turtle-plastron-length-unit-pair",
    title: "Turtle Plastron Length Unit Pair Tool",
    description:
      "Convert a supplied nonnegative turtle plastron length from millimeters to centimeters and meters without determining age or size class.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lengthMillimeters: { type: "number", minimum: 0 } },
      required: ["lengthMillimeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lengthCentimeters: { type: "number" },
        lengthMeters: { type: "number" },
      },
      required: ["lengthCentimeters", "lengthMeters"],
    },
    ports: {
      inputs: [
        {
          id: "lengthMillimeters",
          label: "Length Millimeters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lengthCentimeters",
          label: "Length Centimeters",
          valueType: { type: "number" },
        },
        {
          id: "lengthMeters",
          label: "Length Meters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = turtlePlastronLengthUnitPairTool.execute;
export default turtlePlastronLengthUnitPairTool;
