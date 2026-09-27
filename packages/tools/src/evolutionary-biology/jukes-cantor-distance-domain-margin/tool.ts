import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly mismatchFraction: number };
export type Output = {
  readonly distance: number;
  readonly saturationMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mismatchFraction: { type: "number", minimum: 0, exclusiveMaximum: 0.75 },
  },
  required: ["mismatchFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number" },
    saturationMargin: { type: "number" },
  },
  required: ["distance", "saturationMargin"],
} as const;
/** JC69 equal-frequency equal-rate nucleotide distance; reject the p>=3/4 saturation boundary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mismatchFraction } = request;
  const compute = (): Output => {
    H.domain(mismatchFraction >= 0 && mismatchFraction < 0.75);
    return {
      distance: -0.75 * Math.log1p((-4 * mismatchFraction) / 3),
      saturationMargin: 0.75 - mismatchFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mismatchFraction: 0.3 },
  output: { distance: 0.383119217824493, saturationMargin: 0.45 },
} satisfies ToolExample<Input, Output>;
export const jukesCantorDistanceDomainMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/jukes-cantor-distance-domain-margin",
    title: "Jukes Cantor Distance Domain Margin Tool",
    description:
      "JC69 equal-frequency equal-rate nucleotide distance; reject the p>=3/4 saturation boundary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mismatchFraction: {
          type: "number",
          minimum: 0,
          exclusiveMaximum: 0.75,
        },
      },
      required: ["mismatchFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number" },
        saturationMargin: { type: "number" },
      },
      required: ["distance", "saturationMargin"],
    },
    ports: {
      inputs: [
        {
          id: "mismatchFraction",
          label: "Mismatch Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
        {
          id: "saturationMargin",
          label: "Saturation Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = jukesCantorDistanceDomainMarginTool.execute;
export default jukesCantorDistanceDomainMarginTool;
