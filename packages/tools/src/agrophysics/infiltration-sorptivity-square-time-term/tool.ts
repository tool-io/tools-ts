import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sorptivity: number;
  readonly conductivity: number;
  readonly elapsed: number;
};
export type Output = { readonly cumulativeDepth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sorptivity: { type: "number", minimum: 0 },
    conductivity: { type: "number", minimum: 0 },
    elapsed: { type: "number", minimum: 0 },
  },
  required: ["sorptivity", "conductivity", "elapsed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cumulativeDepth: { type: "number" } },
  required: ["cumulativeDepth"],
} as const;
/** One supplied square-root-time plus linear infiltration model term. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sorptivity, conductivity, elapsed } = request;
  const compute = (): Output => {
    H.domain(sorptivity >= 0 && conductivity >= 0 && elapsed >= 0);
    return {
      cumulativeDepth: sorptivity * Math.sqrt(elapsed) + conductivity * elapsed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sorptivity: 2, conductivity: 0.5, elapsed: 4 },
  output: { cumulativeDepth: 6 },
} satisfies ToolExample<Input, Output>;
export const infiltrationSorptivitySquareTimeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agrophysics/infiltration-sorptivity-square-time-term",
      title: "Infiltration Sorptivity Square Time Term Tool",
      description:
        "One supplied square-root-time plus linear infiltration model term.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sorptivity: { type: "number", minimum: 0 },
          conductivity: { type: "number", minimum: 0 },
          elapsed: { type: "number", minimum: 0 },
        },
        required: ["sorptivity", "conductivity", "elapsed"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { cumulativeDepth: { type: "number" } },
        required: ["cumulativeDepth"],
      },
      ports: {
        inputs: [
          {
            id: "sorptivity",
            label: "Sorptivity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "conductivity",
            label: "Conductivity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "elapsed",
            label: "Elapsed",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "cumulativeDepth",
            label: "Cumulative Depth",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = infiltrationSorptivitySquareTimeTermTool.execute;
export default infiltrationSorptivitySquareTimeTermTool;
