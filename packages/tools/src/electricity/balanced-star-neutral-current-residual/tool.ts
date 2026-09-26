import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly real: readonly number[];
  readonly imaginary: readonly number[];
};
export type Output = {
  readonly real: number;
  readonly imaginary: number;
  readonly magnitude: number;
  readonly balanced: boolean;
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
    real: { type: "number" },
    imaginary: { type: "number" },
    magnitude: { type: "number" },
    balanced: { type: "boolean" },
  },
  required: ["real", "imaginary", "magnitude", "balanced"],
} as const;
/** Calculate balanced star neutral current residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { real, imaginary } = request;
  const compute = (): Output => {
    H.domain(real.length === 3 && imaginary.length === 3);
    const r = real.reduce((a, b) => a + b, 0),
      i = imaginary.reduce((a, b) => a + b, 0);
    return {
      real: r,
      imaginary: i,
      magnitude: Math.hypot(r, i),
      balanced: r === 0 && i === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { real: [2, -1, -1], imaginary: [0, 3, -3] },
  output: { real: 0, imaginary: 0, magnitude: 0, balanced: true },
} satisfies ToolExample<Input, Output>;
export const balancedStarNeutralCurrentResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/balanced-star-neutral-current-residual",
    title: "Balanced Star Neutral Current Residual Tool",
    description:
      "Calculate balanced star neutral current residual from explicit caller-supplied inputs.",
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
        real: { type: "number" },
        imaginary: { type: "number" },
        magnitude: { type: "number" },
        balanced: { type: "boolean" },
      },
      required: ["real", "imaginary", "magnitude", "balanced"],
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
        { id: "real", label: "Real", valueType: { type: "number" } },
        { id: "imaginary", label: "Imaginary", valueType: { type: "number" } },
        { id: "magnitude", label: "Magnitude", valueType: { type: "number" } },
        { id: "balanced", label: "Balanced", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = balancedStarNeutralCurrentResidualTool.execute;
export default balancedStarNeutralCurrentResidualTool;
