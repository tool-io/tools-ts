import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leverX: number;
  readonly leverY: number;
  readonly forceX: number;
  readonly forceY: number;
  readonly reverseNormal: boolean;
};
export type Output = { readonly signedMoment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leverX: { type: "number" },
    leverY: { type: "number" },
    forceX: { type: "number" },
    forceY: { type: "number" },
    reverseNormal: { type: "boolean" },
  },
  required: ["leverX", "leverY", "forceX", "forceY", "reverseNormal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedMoment: { type: "number" } },
  required: ["signedMoment"],
} as const;
/** Resolve the supplied planar force moment under an explicit normal-axis sign. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leverX, leverY, forceX, forceY, reverseNormal } = request;
  const compute = (): Output => {
    return {
      signedMoment:
        (leverX * forceY - leverY * forceX) * (reverseNormal ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leverX: 2, leverY: 0, forceX: 0, forceY: 3, reverseNormal: false },
  output: { signedMoment: 6 },
} satisfies ToolExample<Input, Output>;
export const momentArmSignFromAxisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/moment-arm-sign-from-axis",
    title: "Moment Arm Sign From Axis Tool",
    description:
      "Resolve the supplied planar force moment under an explicit normal-axis sign.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leverX: { type: "number" },
        leverY: { type: "number" },
        forceX: { type: "number" },
        forceY: { type: "number" },
        reverseNormal: { type: "boolean" },
      },
      required: ["leverX", "leverY", "forceX", "forceY", "reverseNormal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedMoment: { type: "number" } },
      required: ["signedMoment"],
    },
    ports: {
      inputs: [
        {
          id: "leverX",
          label: "Lever X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leverY",
          label: "Lever Y",
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
        {
          id: "reverseNormal",
          label: "Reverse Normal",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedMoment",
          label: "Signed Moment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = momentArmSignFromAxisTool.execute;
export default momentArmSignFromAxisTool;
