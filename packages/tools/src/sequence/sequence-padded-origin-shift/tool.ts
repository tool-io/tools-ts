import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalOrigin: number;
  readonly leftPadding: number;
  readonly position: number;
};
export type Output = {
  readonly newOrigin: number;
  readonly originalPosition: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalOrigin: { type: "integer" },
    leftPadding: { type: "integer", minimum: 0 },
    position: { type: "integer", minimum: 0 },
  },
  required: ["originalOrigin", "leftPadding", "position"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newOrigin: { type: "integer" },
    originalPosition: { type: "integer" },
  },
  required: ["newOrigin", "originalPosition"],
} as const;
/** Map an index after left padding to its signed original position, preserving negative padding positions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalOrigin, leftPadding, position } = request;
  const compute = (): Output => {
    H.integer(leftPadding, 0);
    H.integer(position, 0);
    return {
      newOrigin: originalOrigin - leftPadding,
      originalPosition: position - leftPadding,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalOrigin: 10, leftPadding: 3, position: 5 },
  output: { newOrigin: 7, originalPosition: 2 },
} satisfies ToolExample<Input, Output>;
export const sequencePaddedOriginShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/sequence-padded-origin-shift",
    title: "Sequence Padded Origin Shift Tool",
    description:
      "Map an index after left padding to its signed original position, preserving negative padding positions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalOrigin: { type: "integer" },
        leftPadding: { type: "integer", minimum: 0 },
        position: { type: "integer", minimum: 0 },
      },
      required: ["originalOrigin", "leftPadding", "position"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newOrigin: { type: "integer" },
        originalPosition: { type: "integer" },
      },
      required: ["newOrigin", "originalPosition"],
    },
    ports: {
      inputs: [
        {
          id: "originalOrigin",
          label: "Original Origin",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "leftPadding",
          label: "Left Padding",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "position",
          label: "Position",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "newOrigin",
          label: "New Origin",
          valueType: { type: "integer" },
        },
        {
          id: "originalPosition",
          label: "Original Position",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = sequencePaddedOriginShiftTool.execute;
export default sequencePaddedOriginShiftTool;
