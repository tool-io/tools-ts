import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measured: number;
  readonly reference: number;
  readonly coordinate: string;
};
export type Output = {
  readonly signedGap: number;
  readonly absoluteGap: number;
  readonly coordinate: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measured: { type: "number" },
    reference: { type: "number" },
    coordinate: { type: "string", maxLength: 8192, enum: ["L*", "a*", "b*"] },
  },
  required: ["measured", "reference", "coordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGap: { type: "number" },
    absoluteGap: { type: "number" },
    coordinate: { type: "string", maxLength: 8192 },
  },
  required: ["signedGap", "absoluteGap", "coordinate"],
} as const;
/** One supplied CIELAB coordinate difference, without a combined color difference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measured, reference, coordinate } = request;
  const compute = (): Output => {
    H.domain(["L*", "a*", "b*"].includes(coordinate));
    return {
      signedGap: measured - reference,
      absoluteGap: Math.abs(measured - reference),
      coordinate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measured: 52, reference: 50, coordinate: "L*" },
  output: { signedGap: 2, absoluteGap: 2, coordinate: "L*" },
} satisfies ToolExample<Input, Output>;
export const foodColorLabOneCoordinateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/food-color-lab-one-coordinate-gap",
    title: "Food Color Lab One Coordinate Gap Tool",
    description:
      "One supplied CIELAB coordinate difference, without a combined color difference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measured: { type: "number" },
        reference: { type: "number" },
        coordinate: {
          type: "string",
          maxLength: 8192,
          enum: ["L*", "a*", "b*"],
        },
      },
      required: ["measured", "reference", "coordinate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedGap: { type: "number" },
        absoluteGap: { type: "number" },
        coordinate: { type: "string", maxLength: 8192 },
      },
      required: ["signedGap", "absoluteGap", "coordinate"],
    },
    ports: {
      inputs: [
        {
          id: "measured",
          label: "Measured",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
        {
          id: "absoluteGap",
          label: "Absolute Gap",
          valueType: { type: "number" },
        },
        {
          id: "coordinate",
          label: "Coordinate",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodColorLabOneCoordinateGapTool.execute;
export default foodColorLabOneCoordinateGapTool;
