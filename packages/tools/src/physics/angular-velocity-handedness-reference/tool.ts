import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly magnitude: number;
  readonly handedness: string;
  readonly axis: string;
};
export type Output = {
  readonly signedMagnitude: number;
  readonly referenceKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    magnitude: { type: "number", minimum: 0 },
    handedness: { type: "string", maxLength: 8192, enum: ["right", "left"] },
    axis: { type: "string", maxLength: 8192 },
  },
  required: ["magnitude", "handedness", "axis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedMagnitude: { type: "number" },
    referenceKey: { type: "string", maxLength: 8192 },
  },
  required: ["signedMagnitude", "referenceKey"],
} as const;
/** Retain an explicitly named axis and rotation handedness when assigning a scalar angular-velocity sign. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { magnitude, handedness, axis } = request;
  const compute = (): Output => {
    H.domain(
      magnitude >= 0 &&
        ["right", "left"].includes(handedness) &&
        axis.length > 0,
    );
    return {
      signedMagnitude: handedness === "right" ? magnitude : -magnitude,
      referenceKey: JSON.stringify([axis, handedness]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { magnitude: 3, handedness: "right", axis: "+z" },
  output: { signedMagnitude: 3, referenceKey: '["+z","right"]' },
} satisfies ToolExample<Input, Output>;
export const angularVelocityHandednessReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/angular-velocity-handedness-reference",
    title: "Angular Velocity Handedness Reference Tool",
    description:
      "Retain an explicitly named axis and rotation handedness when assigning a scalar angular-velocity sign.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        magnitude: { type: "number", minimum: 0 },
        handedness: {
          type: "string",
          maxLength: 8192,
          enum: ["right", "left"],
        },
        axis: { type: "string", maxLength: 8192 },
      },
      required: ["magnitude", "handedness", "axis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedMagnitude: { type: "number" },
        referenceKey: { type: "string", maxLength: 8192 },
      },
      required: ["signedMagnitude", "referenceKey"],
    },
    ports: {
      inputs: [
        {
          id: "magnitude",
          label: "Magnitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "handedness",
          label: "Handedness",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "axis",
          label: "Axis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedMagnitude",
          label: "Signed Magnitude",
          valueType: { type: "number" },
        },
        {
          id: "referenceKey",
          label: "Reference Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = angularVelocityHandednessReferenceTool.execute;
export default angularVelocityHandednessReferenceTool;
