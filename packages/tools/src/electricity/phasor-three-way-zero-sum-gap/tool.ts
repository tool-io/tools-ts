import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly real: readonly number[];
  readonly imaginary: readonly number[];
};
export type Output = {
  readonly sumReal: number;
  readonly sumImaginary: number;
  readonly magnitude: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    real: { type: "array", maxItems: 256, items: { type: "number" } },
    imaginary: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["real", "imaginary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sumReal: { type: "number" },
    sumImaginary: { type: "number" },
    magnitude: { type: "number" },
  },
  required: ["sumReal", "sumImaginary", "magnitude"],
} as const;
/** Residual of exactly three supplied complex phasors in rectangular coordinates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { real, imaginary } = request;
  const compute = (): Output => {
    H.domain(real.length === 3 && imaginary.length === 3);
    return {
      sumReal: real.reduce((s, x) => s + x, 0),
      sumImaginary: imaginary.reduce((s, x) => s + x, 0),
      magnitude: Math.hypot(
        real.reduce((s, x) => s + x, 0),
        imaginary.reduce((s, x) => s + x, 0),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { real: [1, -1, 0], imaginary: [2, -2, 0] },
  output: { sumReal: 0, sumImaginary: 0, magnitude: 0 },
} satisfies ToolExample<Input, Output>;
export const phasorThreeWayZeroSumGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/phasor-three-way-zero-sum-gap",
    title: "Phasor Three Way Zero Sum Gap Tool",
    description:
      "Residual of exactly three supplied complex phasors in rectangular coordinates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        real: { type: "array", maxItems: 256, items: { type: "number" } },
        imaginary: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["real", "imaginary"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sumReal: { type: "number" },
        sumImaginary: { type: "number" },
        magnitude: { type: "number" },
      },
      required: ["sumReal", "sumImaginary", "magnitude"],
    },
    ports: {
      inputs: [
        {
          id: "real",
          label: "Real",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "imaginary",
          label: "Imaginary",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "sumReal", label: "Sum Real", valueType: { type: "number" } },
        {
          id: "sumImaginary",
          label: "Sum Imaginary",
          valueType: { type: "number" },
        },
        { id: "magnitude", label: "Magnitude", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = phasorThreeWayZeroSumGapTool.execute;
export default phasorThreeWayZeroSumGapTool;
