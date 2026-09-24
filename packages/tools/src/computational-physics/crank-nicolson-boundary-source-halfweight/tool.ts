import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldSource: number;
  readonly newSource: number;
  readonly step: number;
  readonly coefficient: number;
};
export type Output = { readonly sourceIncrement: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldSource: { type: "number" },
    newSource: { type: "number" },
    step: { type: "number", minimum: 0 },
    coefficient: { type: "number" },
  },
  required: ["oldSource", "newSource", "step", "coefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sourceIncrement: { type: "number" } },
  required: ["sourceIncrement"],
} as const;
/** Trapezoidal time weighting of one externally supplied boundary/source contribution, not an entire implicit solve. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldSource, newSource, step, coefficient } = request;
  const compute = (): Output => {
    H.domain(step >= 0);
    return {
      sourceIncrement: (step * coefficient * (oldSource + newSource)) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oldSource: 2, newSource: 4, step: 0.5, coefficient: 3 },
  output: { sourceIncrement: 4.5 },
} satisfies ToolExample<Input, Output>;
export const crankNicolsonBoundarySourceHalfweightTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "computational-physics/crank-nicolson-boundary-source-halfweight",
      title: "Crank Nicolson Boundary Source Halfweight Tool",
      description:
        "Trapezoidal time weighting of one externally supplied boundary/source contribution, not an entire implicit solve.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          oldSource: { type: "number" },
          newSource: { type: "number" },
          step: { type: "number", minimum: 0 },
          coefficient: { type: "number" },
        },
        required: ["oldSource", "newSource", "step", "coefficient"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { sourceIncrement: { type: "number" } },
        required: ["sourceIncrement"],
      },
      ports: {
        inputs: [
          {
            id: "oldSource",
            label: "Old Source",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "newSource",
            label: "New Source",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "step",
            label: "Step",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "coefficient",
            label: "Coefficient",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "sourceIncrement",
            label: "Source Increment",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = crankNicolsonBoundarySourceHalfweightTool.execute;
export default crankNicolsonBoundarySourceHalfweightTool;
