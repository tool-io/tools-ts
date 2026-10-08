import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gapPoints: number;
  readonly totalPoints: number;
};
export type Output = {
  readonly gapFraction: number;
  readonly interceptedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapPoints: { type: "integer", minimum: 0 },
    totalPoints: { type: "integer", minimum: 1 },
  },
  required: ["gapPoints", "totalPoints"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapFraction: { type: "number" },
    interceptedFraction: { type: "number" },
  },
  required: ["gapFraction", "interceptedFraction"],
} as const;
/** Calculate explicit canopy point-sampling gap and intercepted fractions without converting to leaf-area index. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gapPoints, totalPoints } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalPoints) &&
        totalPoints >= 1 &&
        totalPoints <= Number.MAX_SAFE_INTEGER,
      "totalPoints",
    ),
      totalPoints);
    (H.domain(
      Number.isSafeInteger(gapPoints) &&
        gapPoints >= 0 &&
        gapPoints <= totalPoints,
      "gapPoints",
    ),
      gapPoints);
    return {
      gapFraction: gapPoints / totalPoints,
      interceptedFraction: (totalPoints - gapPoints) / totalPoints,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gapPoints: 25, totalPoints: 100 },
  output: { gapFraction: 0.25, interceptedFraction: 0.75 },
} satisfies ToolExample<Input, Output>;
export const gapfractionCanopyInterceptionPointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/gapfraction-canopy-interception-point",
    title: "Gapfraction Canopy Interception Point Tool",
    description:
      "Calculate explicit canopy point-sampling gap and intercepted fractions without converting to leaf-area index.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapPoints: { type: "integer", minimum: 0 },
        totalPoints: { type: "integer", minimum: 1 },
      },
      required: ["gapPoints", "totalPoints"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapFraction: { type: "number" },
        interceptedFraction: { type: "number" },
      },
      required: ["gapFraction", "interceptedFraction"],
    },
    ports: {
      inputs: [
        {
          id: "gapPoints",
          label: "Gap Points",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalPoints",
          label: "Total Points",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "gapFraction",
          label: "Gap Fraction",
          valueType: { type: "number" },
        },
        {
          id: "interceptedFraction",
          label: "Intercepted Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gapfractionCanopyInterceptionPointTool.execute;
export default gapfractionCanopyInterceptionPointTool;
