import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leverArmX: number;
  readonly leverArmY: number;
  readonly forceX: number;
  readonly forceY: number;
};
export type Output = { readonly torqueZ: number; readonly sense: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leverArmX: { type: "number" },
    leverArmY: { type: "number" },
    forceX: { type: "number" },
    forceY: { type: "number" },
  },
  required: ["leverArmX", "leverArmY", "forceX", "forceY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    torqueZ: { type: "number" },
    sense: { type: "string", maxLength: 8192 },
  },
  required: ["torqueZ", "sense"],
} as const;
/** Compute signed planar torque r cross F, positive counterclockwise for a right-handed x-y frame. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leverArmX, leverArmY, forceX, forceY } = request;
  const compute = (): Output => {
    return (() => {
      const torqueZ = leverArmX * forceY - leverArmY * forceX;
      return {
        torqueZ,
        sense:
          torqueZ > 0 ? "counterclockwise" : torqueZ < 0 ? "clockwise" : "zero",
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leverArmX: 2, leverArmY: 0, forceX: 0, forceY: 3 },
  output: { torqueZ: 6, sense: "counterclockwise" },
} satisfies ToolExample<Input, Output>;
export const forceTorqueLeverArmSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/force-torque-lever-arm-sign",
    title: "Force Torque Lever Arm Sign Tool",
    description:
      "Compute signed planar torque r cross F, positive counterclockwise for a right-handed x-y frame.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leverArmX: { type: "number" },
        leverArmY: { type: "number" },
        forceX: { type: "number" },
        forceY: { type: "number" },
      },
      required: ["leverArmX", "leverArmY", "forceX", "forceY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        torqueZ: { type: "number" },
        sense: { type: "string", maxLength: 8192 },
      },
      required: ["torqueZ", "sense"],
    },
    ports: {
      inputs: [
        {
          id: "leverArmX",
          label: "Lever Arm X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leverArmY",
          label: "Lever Arm Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "forceX",
          label: "Force X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "forceY",
          label: "Force Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "torqueZ", label: "Torque Z", valueType: { type: "number" } },
        { id: "sense", label: "Sense", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = forceTorqueLeverArmSignTool.execute;
export default forceTorqueLeverArmSignTool;
