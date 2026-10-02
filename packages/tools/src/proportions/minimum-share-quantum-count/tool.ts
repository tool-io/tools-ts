import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly total: number;
  readonly minimumFraction: number;
  readonly quantum: number;
};
export type Output = { readonly quanta: number; readonly actualShare: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: { type: "number", exclusiveMinimum: 0 },
    minimumFraction: { type: "number", minimum: 0, maximum: 1 },
    quantum: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["total", "minimumFraction", "quantum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { quanta: { type: "integer" }, actualShare: { type: "number" } },
  required: ["quanta", "actualShare"],
} as const;
/** Calculate minimum share quantum count from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { total, minimumFraction, quantum } = input;
  const compute = (): Output => {
    H.positive(total);
    H.probability(minimumFraction);
    H.positive(quantum);
    const quanta = Math.ceil((total * minimumFraction) / quantum);
    return { quanta, actualShare: (quanta * quantum) / total };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { total: 100, minimumFraction: 0.23, quantum: 5 },
  output: { quanta: 5, actualShare: 0.25 },
} satisfies ToolExample<Input, Output>;
export const minimumShareQuantumCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/minimum-share-quantum-count",
    title: "Minimum Share Quantum Count Tool",
    description:
      "Calculate minimum share quantum count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        total: { type: "number", exclusiveMinimum: 0 },
        minimumFraction: { type: "number", minimum: 0, maximum: 1 },
        quantum: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["total", "minimumFraction", "quantum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quanta: { type: "integer" },
        actualShare: { type: "number" },
      },
      required: ["quanta", "actualShare"],
    },
    ports: {
      inputs: [
        {
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimumFraction",
          label: "Minimum Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantum",
          label: "Quantum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "quanta", label: "Quanta", valueType: { type: "integer" } },
        {
          id: "actualShare",
          label: "Actual Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = minimumShareQuantumCountTool.execute;
export default minimumShareQuantumCountTool;
