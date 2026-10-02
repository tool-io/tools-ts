import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reflectionCoefficient: number };
export type Output = {
  readonly inverted: boolean;
  readonly zeroReflection: boolean;
  readonly phaseRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reflectionCoefficient: { type: "number", minimum: -1, maximum: 1 },
  },
  required: ["reflectionCoefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inverted: { type: "boolean" },
    zeroReflection: { type: "boolean" },
    phaseRadians: { type: "number" },
  },
  required: ["inverted", "zeroReflection", "phaseRadians"],
} as const;
/** Classify the phase sign of a real amplitude reflection coefficient, retaining an explicit zero-reflection flag. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { reflectionCoefficient } = input;
  const compute = (): Output => {
    H.domain(reflectionCoefficient >= -1 && reflectionCoefficient <= 1);
    return {
      inverted: reflectionCoefficient < 0,
      zeroReflection: reflectionCoefficient === 0,
      phaseRadians: reflectionCoefficient < 0 ? Math.PI : 0,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { reflectionCoefficient: -0.5 },
  output: {
    inverted: true,
    zeroReflection: false,
    phaseRadians: 3.141592653589793,
  },
} satisfies ToolExample<Input, Output>;
export const waveBoundaryPhaseInversionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/wave-boundary-phase-inversion-flag",
    title: "Wave Boundary Phase Inversion Flag Tool",
    description:
      "Classify the phase sign of a real amplitude reflection coefficient, retaining an explicit zero-reflection flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reflectionCoefficient: { type: "number", minimum: -1, maximum: 1 },
      },
      required: ["reflectionCoefficient"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inverted: { type: "boolean" },
        zeroReflection: { type: "boolean" },
        phaseRadians: { type: "number" },
      },
      required: ["inverted", "zeroReflection", "phaseRadians"],
    },
    ports: {
      inputs: [
        {
          id: "reflectionCoefficient",
          label: "Reflection Coefficient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "inverted", label: "Inverted", valueType: { type: "boolean" } },
        {
          id: "zeroReflection",
          label: "Zero Reflection",
          valueType: { type: "boolean" },
        },
        {
          id: "phaseRadians",
          label: "Phase Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = waveBoundaryPhaseInversionFlagTool.execute;
export default waveBoundaryPhaseInversionFlagTool;
