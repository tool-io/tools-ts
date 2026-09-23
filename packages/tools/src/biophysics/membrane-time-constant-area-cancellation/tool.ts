import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specificResistance: number;
  readonly specificCapacitance: number;
  readonly area: number;
};
export type Output = {
  readonly resistance: number;
  readonly capacitance: number;
  readonly timeConstant: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specificResistance: { type: "number", minimum: 0 },
    specificCapacitance: { type: "number", minimum: 0 },
    area: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["specificResistance", "specificCapacitance", "area"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resistance: { type: "number" },
    capacitance: { type: "number" },
    timeConstant: { type: "number" },
  },
  required: ["resistance", "capacitance", "timeConstant"],
} as const;
/** Specific resistance is resistance times area, and specific capacitance is capacitance per area, so their product is area independent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specificResistance, specificCapacitance, area } = request;
  const compute = (): Output => {
    H.domain(specificResistance >= 0 && specificCapacitance >= 0);
    H.positive(area);
    return {
      resistance: specificResistance / area,
      capacitance: specificCapacitance * area,
      timeConstant: specificResistance * specificCapacitance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specificResistance: 100, specificCapacitance: 0.01, area: 2 },
  output: { resistance: 50, capacitance: 0.02, timeConstant: 1 },
} satisfies ToolExample<Input, Output>;
export const membraneTimeConstantAreaCancellationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biophysics/membrane-time-constant-area-cancellation",
      title: "Membrane Time Constant Area Cancellation Tool",
      description:
        "Specific resistance is resistance times area, and specific capacitance is capacitance per area, so their product is area independent.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          specificResistance: { type: "number", minimum: 0 },
          specificCapacitance: { type: "number", minimum: 0 },
          area: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["specificResistance", "specificCapacitance", "area"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resistance: { type: "number" },
          capacitance: { type: "number" },
          timeConstant: { type: "number" },
        },
        required: ["resistance", "capacitance", "timeConstant"],
      },
      ports: {
        inputs: [
          {
            id: "specificResistance",
            label: "Specific Resistance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "specificCapacitance",
            label: "Specific Capacitance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "area",
            label: "Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "resistance",
            label: "Resistance",
            valueType: { type: "number" },
          },
          {
            id: "capacitance",
            label: "Capacitance",
            valueType: { type: "number" },
          },
          {
            id: "timeConstant",
            label: "Time Constant",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = membraneTimeConstantAreaCancellationTool.execute;
export default membraneTimeConstantAreaCancellationTool;
