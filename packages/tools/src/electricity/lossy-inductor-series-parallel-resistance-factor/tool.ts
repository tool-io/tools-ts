import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seriesResistance: number;
  readonly reactance: number;
};
export type Output = {
  readonly parallelResistance: number;
  readonly q: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seriesResistance: { type: "number", exclusiveMinimum: 0 },
    reactance: { type: "number" },
  },
  required: ["seriesResistance", "reactance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { parallelResistance: { type: "number" }, q: { type: "number" } },
  required: ["parallelResistance", "q"],
} as const;
/** Calculate lossy inductor series parallel resistance factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seriesResistance, reactance } = request;
  const compute = (): Output => {
    H.positive(seriesResistance);
    const q = reactance / seriesResistance;
    return { parallelResistance: seriesResistance * (1 + q * q), q };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { seriesResistance: 2, reactance: 6 },
  output: { parallelResistance: 20, q: 3 },
} satisfies ToolExample<Input, Output>;
export const lossyInductorSeriesParallelResistanceFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electricity/lossy-inductor-series-parallel-resistance-factor",
      title: "Lossy Inductor Series Parallel Resistance Factor Tool",
      description:
        "Calculate lossy inductor series parallel resistance factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          seriesResistance: { type: "number", exclusiveMinimum: 0 },
          reactance: { type: "number" },
        },
        required: ["seriesResistance", "reactance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parallelResistance: { type: "number" },
          q: { type: "number" },
        },
        required: ["parallelResistance", "q"],
      },
      ports: {
        inputs: [
          {
            id: "seriesResistance",
            label: "Series Resistance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reactance",
            label: "Reactance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "parallelResistance",
            label: "Parallel Resistance",
            valueType: { type: "number" },
          },
          { id: "q", label: "Q", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = lossyInductorSeriesParallelResistanceFactorTool.execute;
export default lossyInductorSeriesParallelResistanceFactorTool;
