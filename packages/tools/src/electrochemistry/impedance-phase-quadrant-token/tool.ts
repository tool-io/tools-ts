import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly real: number; readonly imaginary: number };
export type Output = {
  readonly quadrant: string;
  readonly phaseDefined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { real: { type: "number" }, imaginary: { type: "number" } },
  required: ["real", "imaginary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quadrant: { type: "string", maxLength: 8192 },
    phaseDefined: { type: "boolean" },
  },
  required: ["quadrant", "phaseDefined"],
} as const;
/** Classify explicit impedance component signs without computing a numerical phase angle. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { real, imaginary } = request;
  const compute = (): Output => {
    return {
      quadrant:
        real === 0 && imaginary === 0
          ? "origin"
          : imaginary === 0
            ? real > 0
              ? "positive-real"
              : "negative-real"
            : real === 0
              ? imaginary > 0
                ? "positive-imaginary"
                : "negative-imaginary"
              : real > 0
                ? imaginary > 0
                  ? "I"
                  : "IV"
                : imaginary > 0
                  ? "II"
                  : "III",
      phaseDefined: real !== 0 || imaginary !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { real: -2, imaginary: 3 },
  output: { quadrant: "II", phaseDefined: true },
} satisfies ToolExample<Input, Output>;
export const impedancePhaseQuadrantTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/impedance-phase-quadrant-token",
    title: "Impedance Phase Quadrant Token Tool",
    description:
      "Classify explicit impedance component signs without computing a numerical phase angle.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { real: { type: "number" }, imaginary: { type: "number" } },
      required: ["real", "imaginary"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quadrant: { type: "string", maxLength: 8192 },
        phaseDefined: { type: "boolean" },
      },
      required: ["quadrant", "phaseDefined"],
    },
    ports: {
      inputs: [
        {
          id: "real",
          label: "Real",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imaginary",
          label: "Imaginary",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "quadrant", label: "Quadrant", valueType: { type: "string" } },
        {
          id: "phaseDefined",
          label: "Phase Defined",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = impedancePhaseQuadrantTokenTool.execute;
export default impedancePhaseQuadrantTokenTool;
