import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resistance: number;
  readonly cellConstant: number;
};
export type Output = {
  readonly conductance: number;
  readonly conductivity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resistance: { type: "number", exclusiveMinimum: 0 },
    cellConstant: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["resistance", "cellConstant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conductance: { type: "number" },
    conductivity: { type: "number" },
  },
  required: ["conductance", "conductivity"],
} as const;
/** Calculate electrolyte conductivity cell constant factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resistance, cellConstant } = request;
  const compute = (): Output => {
    H.positive(resistance);
    H.positive(cellConstant);
    return {
      conductance: 1 / resistance,
      conductivity: cellConstant / resistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resistance: 100, cellConstant: 2 },
  output: { conductance: 0.01, conductivity: 0.02 },
} satisfies ToolExample<Input, Output>;
export const electrolyteConductivityCellConstantFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electrochemistry/electrolyte-conductivity-cell-constant-factor",
      title: "Electrolyte Conductivity Cell Constant Factor Tool",
      description:
        "Calculate electrolyte conductivity cell constant factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resistance: { type: "number", exclusiveMinimum: 0 },
          cellConstant: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["resistance", "cellConstant"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conductance: { type: "number" },
          conductivity: { type: "number" },
        },
        required: ["conductance", "conductivity"],
      },
      ports: {
        inputs: [
          {
            id: "resistance",
            label: "Resistance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cellConstant",
            label: "Cell Constant",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "conductance",
            label: "Conductance",
            valueType: { type: "number" },
          },
          {
            id: "conductivity",
            label: "Conductivity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = electrolyteConductivityCellConstantFactorTool.execute;
export default electrolyteConductivityCellConstantFactorTool;
