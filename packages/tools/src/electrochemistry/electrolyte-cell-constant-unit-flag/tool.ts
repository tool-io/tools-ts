import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellConstant: number;
  readonly sourceLengthInBaseUnits: number;
  readonly conductance: number;
};
export type Output = {
  readonly baseConstant: number;
  readonly conductivity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellConstant: { type: "number", minimum: 0 },
    sourceLengthInBaseUnits: { type: "number", exclusiveMinimum: 0 },
    conductance: { type: "number", minimum: 0 },
  },
  required: ["cellConstant", "sourceLengthInBaseUnits", "conductance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseConstant: { type: "number" },
    conductivity: { type: "number" },
  },
  required: ["baseConstant", "conductivity"],
} as const;
/** Convert a cell constant from inverse source-length units by dividing by source length in base units, then multiply by supplied conductance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellConstant, sourceLengthInBaseUnits, conductance } = request;
  const compute = (): Output => {
    H.positive(sourceLengthInBaseUnits);
    H.domain(cellConstant >= 0 && conductance >= 0);
    const baseConstant = cellConstant / sourceLengthInBaseUnits;
    return { baseConstant, conductivity: baseConstant * conductance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cellConstant: 2, sourceLengthInBaseUnits: 0.01, conductance: 3 },
  output: { baseConstant: 200, conductivity: 600 },
} satisfies ToolExample<Input, Output>;
export const electrolyteCellConstantUnitFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/electrolyte-cell-constant-unit-flag",
    title: "Electrolyte Cell Constant Unit Flag Tool",
    description:
      "Convert a cell constant from inverse source-length units by dividing by source length in base units, then multiply by supplied conductance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellConstant: { type: "number", minimum: 0 },
        sourceLengthInBaseUnits: { type: "number", exclusiveMinimum: 0 },
        conductance: { type: "number", minimum: 0 },
      },
      required: ["cellConstant", "sourceLengthInBaseUnits", "conductance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseConstant: { type: "number" },
        conductivity: { type: "number" },
      },
      required: ["baseConstant", "conductivity"],
    },
    ports: {
      inputs: [
        {
          id: "cellConstant",
          label: "Cell Constant",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceLengthInBaseUnits",
          label: "Source Length In Base Units",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "conductance",
          label: "Conductance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "baseConstant",
          label: "Base Constant",
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
export const run = electrolyteCellConstantUnitFlagTool.execute;
export default electrolyteCellConstantUnitFlagTool;
