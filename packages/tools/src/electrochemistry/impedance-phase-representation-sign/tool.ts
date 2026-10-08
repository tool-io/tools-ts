import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly phaseDegrees: number;
  readonly reverseImaginaryAxis: boolean;
};
export type Output = { readonly representedPhaseDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseDegrees: { type: "number" },
    reverseImaginaryAxis: { type: "boolean" },
  },
  required: ["phaseDegrees", "reverseImaginaryAxis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { representedPhaseDegrees: { type: "number" } },
  required: ["representedPhaseDegrees"],
} as const;
/** Reverse an explicit impedance phase sign when the supplied imaginary-axis representation is reversed, without changing magnitudes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { phaseDegrees, reverseImaginaryAxis } = request;
  const compute = (): Output => {
    return {
      representedPhaseDegrees: reverseImaginaryAxis
        ? -phaseDegrees
        : phaseDegrees,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { phaseDegrees: -45, reverseImaginaryAxis: true },
  output: { representedPhaseDegrees: 45 },
} satisfies ToolExample<Input, Output>;
export const impedancePhaseRepresentationSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/impedance-phase-representation-sign",
    title: "Impedance Phase Representation Sign Tool",
    description:
      "Reverse an explicit impedance phase sign when the supplied imaginary-axis representation is reversed, without changing magnitudes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseDegrees: { type: "number" },
        reverseImaginaryAxis: { type: "boolean" },
      },
      required: ["phaseDegrees", "reverseImaginaryAxis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { representedPhaseDegrees: { type: "number" } },
      required: ["representedPhaseDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "phaseDegrees",
          label: "Phase Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseImaginaryAxis",
          label: "Reverse Imaginary Axis",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "representedPhaseDegrees",
          label: "Represented Phase Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = impedancePhaseRepresentationSignTool.execute;
export default impedancePhaseRepresentationSignTool;
