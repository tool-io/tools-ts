import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angleDegrees: number;
  readonly zeroDegrees: number;
};
export type Output = { readonly phaseDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angleDegrees: { type: "number" },
    zeroDegrees: { type: "number" },
  },
  required: ["angleDegrees", "zeroDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phaseDegrees: { type: "number" } },
  required: ["phaseDegrees"],
} as const;
/** Express a finite angle as a positive phase in [0,360) degrees relative to an explicit zero direction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angleDegrees, zeroDegrees } = request;
  const compute = (): Output => {
    const r = ((angleDegrees % 360) - (zeroDegrees % 360)) % 360;
    return { phaseDegrees: r < 0 ? r + 360 : r };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angleDegrees: 15, zeroDegrees: 350 },
  output: { phaseDegrees: 25 },
} satisfies ToolExample<Input, Output>;
export const anglePhaseZeroReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/angle-phase-zero-reference",
    title: "Angle Phase Zero Reference Tool",
    description:
      "Express a finite angle as a positive phase in [0,360) degrees relative to an explicit zero direction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angleDegrees: { type: "number" },
        zeroDegrees: { type: "number" },
      },
      required: ["angleDegrees", "zeroDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { phaseDegrees: { type: "number" } },
      required: ["phaseDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "angleDegrees",
          label: "Angle Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroDegrees",
          label: "Zero Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "phaseDegrees",
          label: "Phase Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = anglePhaseZeroReferenceTool.execute;
export default anglePhaseZeroReferenceTool;
