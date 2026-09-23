import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fx: number;
  readonly fy: number;
  readonly fxx: number;
  readonly fxy: number;
  readonly fyy: number;
};
export type Output = { readonly secondDerivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fx: { type: "number" },
    fy: { type: "number" },
    fxx: { type: "number" },
    fxy: { type: "number" },
    fyy: { type: "number" },
  },
  required: ["fx", "fy", "fxx", "fxy", "fyy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { secondDerivative: { type: "number" } },
  required: ["secondDerivative"],
} as const;
/** Calculate implicit second partial diagonal term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { fx, fy, fxx, fxy, fyy } = input;
  const compute = (): Output => {
    H.domain(fy !== 0);
    const y1 = -fx / fy;
    return { secondDerivative: -(fxx + 2 * fxy * y1 + fyy * y1 * y1) / fy };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { fx: 2, fy: 4, fxx: 6, fxy: 1, fyy: 2 },
  output: { secondDerivative: -1.375 },
} satisfies ToolExample<Input, Output>;
export const implicitSecondPartialDiagonalTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/implicit-second-partial-diagonal-term",
    title: "Implicit Second Partial Diagonal Term Tool",
    description:
      "Calculate implicit second partial diagonal term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fx: { type: "number" },
        fy: { type: "number" },
        fxx: { type: "number" },
        fxy: { type: "number" },
        fyy: { type: "number" },
      },
      required: ["fx", "fy", "fxx", "fxy", "fyy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { secondDerivative: { type: "number" } },
      required: ["secondDerivative"],
    },
    ports: {
      inputs: [
        {
          id: "fx",
          label: "Fx",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fy",
          label: "Fy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fxx",
          label: "Fxx",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fxy",
          label: "Fxy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fyy",
          label: "Fyy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "secondDerivative",
          label: "Second Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = implicitSecondPartialDiagonalTermTool.execute;
export default implicitSecondPartialDiagonalTermTool;
