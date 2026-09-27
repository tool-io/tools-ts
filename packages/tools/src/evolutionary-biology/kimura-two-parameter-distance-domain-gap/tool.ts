import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly transitionFraction: number;
  readonly transversionFraction: number;
};
export type Output = {
  readonly distance: number;
  readonly transitionLogMargin: number;
  readonly transversionLogMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transitionFraction: { type: "number", minimum: 0 },
    transversionFraction: { type: "number", minimum: 0 },
  },
  required: ["transitionFraction", "transversionFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number" },
    transitionLogMargin: { type: "number" },
    transversionLogMargin: { type: "number" },
  },
  required: ["distance", "transitionLogMargin", "transversionLogMargin"],
} as const;
/** K80 nucleotide distance with separately supplied transition and transversion mismatch fractions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { transitionFraction, transversionFraction } = request;
  const compute = (): Output => {
    H.domain(
      transitionFraction >= 0 &&
        transversionFraction >= 0 &&
        2 * transitionFraction + transversionFraction < 1 &&
        2 * transversionFraction < 1,
    );
    return {
      distance:
        -0.5 * Math.log1p(-2 * transitionFraction - transversionFraction) -
        0.25 * Math.log1p(-2 * transversionFraction),
      transitionLogMargin: 1 - 2 * transitionFraction - transversionFraction,
      transversionLogMargin: 1 - 2 * transversionFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { transitionFraction: 0.1, transversionFraction: 0.1 },
  output: {
    distance: 0.23412335979791865,
    transitionLogMargin: 0.7000000000000001,
    transversionLogMargin: 0.8,
  },
} satisfies ToolExample<Input, Output>;
export const kimuraTwoParameterDistanceDomainGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "evolutionary-biology/kimura-two-parameter-distance-domain-gap",
      title: "Kimura Two Parameter Distance Domain Gap Tool",
      description:
        "K80 nucleotide distance with separately supplied transition and transversion mismatch fractions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          transitionFraction: { type: "number", minimum: 0 },
          transversionFraction: { type: "number", minimum: 0 },
        },
        required: ["transitionFraction", "transversionFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distance: { type: "number" },
          transitionLogMargin: { type: "number" },
          transversionLogMargin: { type: "number" },
        },
        required: ["distance", "transitionLogMargin", "transversionLogMargin"],
      },
      ports: {
        inputs: [
          {
            id: "transitionFraction",
            label: "Transition Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "transversionFraction",
            label: "Transversion Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "distance", label: "Distance", valueType: { type: "number" } },
          {
            id: "transitionLogMargin",
            label: "Transition Log Margin",
            valueType: { type: "number" },
          },
          {
            id: "transversionLogMargin",
            label: "Transversion Log Margin",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = kimuraTwoParameterDistanceDomainGapTool.execute;
export default kimuraTwoParameterDistanceDomainGapTool;
