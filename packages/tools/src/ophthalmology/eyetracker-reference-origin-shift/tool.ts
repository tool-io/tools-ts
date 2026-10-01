import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly y: number;
  readonly oldOriginX: number;
  readonly oldOriginY: number;
  readonly newOriginX: number;
  readonly newOriginY: number;
};
export type Output = { readonly x: number; readonly y: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    y: { type: "number" },
    oldOriginX: { type: "number" },
    oldOriginY: { type: "number" },
    newOriginX: { type: "number" },
    newOriginY: { type: "number" },
  },
  required: ["x", "y", "oldOriginX", "oldOriginY", "newOriginX", "newOriginY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" }, y: { type: "number" } },
  required: ["x", "y"],
} as const;
/** Translate supplied eye-tracker coordinates between origins in one coordinate basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, y, oldOriginX, oldOriginY, newOriginX, newOriginY } = request;
  const compute = (): Output => {
    return { x: x + oldOriginX - newOriginX, y: y + oldOriginY - newOriginY };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    x: 10,
    y: 20,
    oldOriginX: 5,
    oldOriginY: 7,
    newOriginX: 2,
    newOriginY: 3,
  },
  output: { x: 13, y: 24 },
} satisfies ToolExample<Input, Output>;
export const eyetrackerReferenceOriginShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ophthalmology/eyetracker-reference-origin-shift",
    title: "Eyetracker Reference Origin Shift Tool",
    description:
      "Translate supplied eye-tracker coordinates between origins in one coordinate basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        y: { type: "number" },
        oldOriginX: { type: "number" },
        oldOriginY: { type: "number" },
        newOriginX: { type: "number" },
        newOriginY: { type: "number" },
      },
      required: [
        "x",
        "y",
        "oldOriginX",
        "oldOriginY",
        "newOriginX",
        "newOriginY",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number" }, y: { type: "number" } },
      required: ["x", "y"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        { id: "y", label: "Y", required: true, valueType: { type: "number" } },
        {
          id: "oldOriginX",
          label: "Old Origin X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldOriginY",
          label: "Old Origin Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newOriginX",
          label: "New Origin X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newOriginY",
          label: "New Origin Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "x", label: "X", valueType: { type: "number" } },
        { id: "y", label: "Y", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = eyetrackerReferenceOriginShiftTool.execute;
export default eyetrackerReferenceOriginShiftTool;
