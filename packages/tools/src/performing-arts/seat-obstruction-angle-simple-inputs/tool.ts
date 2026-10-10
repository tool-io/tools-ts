import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly obstructionTopHeight: number;
  readonly eyeHeight: number;
  readonly horizontalDistance: number;
};
export type Output = { readonly obstructionAngleRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    obstructionTopHeight: { type: "number" },
    eyeHeight: { type: "number" },
    horizontalDistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["obstructionTopHeight", "eyeHeight", "horizontalDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { obstructionAngleRadians: { type: "number" } },
  required: ["obstructionAngleRadians"],
} as const;
/** Calculate an explicit obstruction-top elevation angle from an eye reference without modeling full theater sightlines. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { obstructionTopHeight, eyeHeight, horizontalDistance } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(horizontalDistance) && horizontalDistance > 0,
      "horizontalDistance",
    ),
      horizontalDistance);
    return {
      obstructionAngleRadians: Math.atan2(
        obstructionTopHeight - eyeHeight,
        horizontalDistance,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { obstructionTopHeight: 2, eyeHeight: 1, horizontalDistance: 1 },
  output: { obstructionAngleRadians: 0.7853981633974483 },
} satisfies ToolExample<Input, Output>;
export const seatObstructionAngleSimpleInputsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["performing-arts", "performing arts", "arts and design"],
      keywords: ["performing arts", "arts and design"],
    },
    id: "performing-arts/seat-obstruction-angle-simple-inputs",
    title: "Seat Obstruction Angle Simple Inputs",
    description:
      "Calculate an explicit obstruction-top elevation angle from an eye reference without modeling full theater sightlines.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        obstructionTopHeight: { type: "number" },
        eyeHeight: { type: "number" },
        horizontalDistance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["obstructionTopHeight", "eyeHeight", "horizontalDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { obstructionAngleRadians: { type: "number" } },
      required: ["obstructionAngleRadians"],
    },
    ports: {
      inputs: [
        {
          id: "obstructionTopHeight",
          label: "Obstruction Top Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eyeHeight",
          label: "Eye Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "horizontalDistance",
          label: "Horizontal Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "obstructionAngleRadians",
          label: "Obstruction Angle Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seatObstructionAngleSimpleInputsTool.execute;
export default seatObstructionAngleSimpleInputsTool;
