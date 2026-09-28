import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly chord: number; readonly sagitta: number };
export type Output = {
  readonly curvature: number;
  readonly sagittaDerivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chord: { type: "number", exclusiveMinimum: 0 },
    sagitta: { type: "number", minimum: 0 },
  },
  required: ["chord", "sagitta"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    curvature: { type: "number" },
    sagittaDerivative: { type: "number" },
  },
  required: ["curvature", "sagittaDerivative"],
} as const;
/** Circular curvature and its derivative with respect to supplied sagitta at fixed chord length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chord, sagitta } = request;
  const compute = (): Output => {
    H.positive(chord);
    H.domain(sagitta >= 0);
    return {
      curvature: (8 * sagitta) / (chord ** 2 + 4 * sagitta ** 2),
      sagittaDerivative:
        (8 * (chord ** 2 - 4 * sagitta ** 2)) /
        (chord ** 2 + 4 * sagitta ** 2) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { chord: 2, sagitta: 1 },
  output: { curvature: 1, sagittaDerivative: 0 },
} satisfies ToolExample<Input, Output>;
export const chordSagittaCurvatureSensitivityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/chord-sagitta-curvature-sensitivity",
    title: "Chord Sagitta Curvature Sensitivity Tool",
    description:
      "Circular curvature and its derivative with respect to supplied sagitta at fixed chord length.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chord: { type: "number", exclusiveMinimum: 0 },
        sagitta: { type: "number", minimum: 0 },
      },
      required: ["chord", "sagitta"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        curvature: { type: "number" },
        sagittaDerivative: { type: "number" },
      },
      required: ["curvature", "sagittaDerivative"],
    },
    ports: {
      inputs: [
        {
          id: "chord",
          label: "Chord",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sagitta",
          label: "Sagitta",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "curvature", label: "Curvature", valueType: { type: "number" } },
        {
          id: "sagittaDerivative",
          label: "Sagitta Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = chordSagittaCurvatureSensitivityTool.execute;
export default chordSagittaCurvatureSensitivityTool;
