import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly phaseFraction: number;
  readonly referenceFraction: number;
};
export type Output = { readonly signedShortestGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseFraction: { type: "number", minimum: 0, maximum: 1 },
    referenceFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["phaseFraction", "referenceFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedShortestGap: { type: "number" } },
  required: ["signedShortestGap"],
} as const;
/** Compare supplied research cycle phases with a positive half-cycle tie convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { phaseFraction, referenceFraction } = request;
  const compute = (): Output => {
    const positiveRemainder = (x: number, n: number): number => {
      const r = x % n;
      if (r >= 0) return r;
      const v = r + n;
      return v === n ? 0 : v;
    };
    H.probability(phaseFraction);
    H.probability(referenceFraction);
    return {
      signedShortestGap: (() => {
        const d = positiveRemainder(phaseFraction - referenceFraction, 1);
        return d > 0.5 ? d - 1 : d;
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { phaseFraction: 0.9, referenceFraction: 0.1 },
  output: { signedShortestGap: -0.19999999999999996 },
} satisfies ToolExample<Input, Output>;
export const motionRepetitionPhaseGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiotherapy/motion-repetition-phase-gap",
    title: "Motion Repetition Phase Gap Tool",
    description:
      "Compare supplied research cycle phases with a positive half-cycle tie convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseFraction: { type: "number", minimum: 0, maximum: 1 },
        referenceFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["phaseFraction", "referenceFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedShortestGap: { type: "number" } },
      required: ["signedShortestGap"],
    },
    ports: {
      inputs: [
        {
          id: "phaseFraction",
          label: "Phase Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceFraction",
          label: "Reference Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedShortestGap",
          label: "Signed Shortest Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = motionRepetitionPhaseGapTool.execute;
export default motionRepetitionPhaseGapTool;
