import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly real: readonly number[];
  readonly imaginary: readonly number[];
};
export type Output = {
  readonly residualReal: number;
  readonly residualImaginary: number;
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
    residualReal: { type: "number" },
    residualImaginary: { type: "number" },
    magnitude: { type: "number" },
  },
  required: ["residualReal", "residualImaginary", "magnitude"],
} as const;
/** Sum three supplied RMS conductor-current phasors algebraically without a protection or safety verdict. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { real, imaginary } = input;
  const compute = (): Output => {
    H.domain(real.length === 3 && imaginary.length === 3);
    const residualReal = real.reduce((a, b) => a + b, 0),
      residualImaginary = imaginary.reduce((a, b) => a + b, 0);
    return {
      residualReal,
      residualImaginary,
      magnitude: Math.hypot(residualReal, residualImaginary),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { real: [1, -1, 0], imaginary: [0, 0, 0] },
  output: { residualReal: 0, residualImaginary: 0, magnitude: 0 },
} satisfies ToolExample<Input, Output>;
export const residualCurrentThreeConductorVectorTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electricity/residual-current-three-conductor-vector-term",
      title: "Residual Current Three Conductor Vector Term Tool",
      description:
        "Sum three supplied RMS conductor-current phasors algebraically without a protection or safety verdict.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          real: { type: "array", maxItems: 256, items: { type: "number" } },
          imaginary: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["real", "imaginary"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residualReal: { type: "number" },
          residualImaginary: { type: "number" },
          magnitude: { type: "number" },
        },
        required: ["residualReal", "residualImaginary", "magnitude"],
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
          {
            id: "residualReal",
            label: "Residual Real",
            valueType: { type: "number" },
          },
          {
            id: "residualImaginary",
            label: "Residual Imaginary",
            valueType: { type: "number" },
          },
          {
            id: "magnitude",
            label: "Magnitude",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = residualCurrentThreeConductorVectorTermTool.execute;
export default residualCurrentThreeConductorVectorTermTool;
