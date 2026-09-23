import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly relativePermittivity: number;
  readonly vacuumPermittivity: number;
  readonly area: number;
  readonly thickness: number;
};
export type Output = {
  readonly capacitance: number;
  readonly capacitancePerArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativePermittivity: { type: "number", exclusiveMinimum: 0 },
    vacuumPermittivity: { type: "number", exclusiveMinimum: 0 },
    area: { type: "number", minimum: 0 },
    thickness: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["relativePermittivity", "vacuumPermittivity", "area", "thickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacitance: { type: "number" },
    capacitancePerArea: { type: "number" },
  },
  required: ["capacitance", "capacitancePerArea"],
} as const;
/** Ideal uniform parallel-plate membrane in SI units, excluding fringing and frequency dispersion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { relativePermittivity, vacuumPermittivity, area, thickness } = request;
  const compute = (): Output => {
    H.positive(relativePermittivity);
    H.positive(vacuumPermittivity);
    H.domain(area >= 0);
    H.positive(thickness);
    return {
      capacitance:
        (relativePermittivity * vacuumPermittivity * area) / thickness,
      capacitancePerArea:
        (relativePermittivity * vacuumPermittivity) / thickness,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    relativePermittivity: 2,
    vacuumPermittivity: 8.85e-12,
    area: 0.01,
    thickness: 0.000001,
  },
  output: { capacitance: 1.77e-7, capacitancePerArea: 0.000017700000000000003 },
} satisfies ToolExample<Input, Output>;
export const membraneCapacitanceAreaThicknessFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biophysics/membrane-capacitance-area-thickness-factor",
      title: "Membrane Capacitance Area Thickness Factor Tool",
      description:
        "Ideal uniform parallel-plate membrane in SI units, excluding fringing and frequency dispersion.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          relativePermittivity: { type: "number", exclusiveMinimum: 0 },
          vacuumPermittivity: { type: "number", exclusiveMinimum: 0 },
          area: { type: "number", minimum: 0 },
          thickness: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "relativePermittivity",
          "vacuumPermittivity",
          "area",
          "thickness",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          capacitance: { type: "number" },
          capacitancePerArea: { type: "number" },
        },
        required: ["capacitance", "capacitancePerArea"],
      },
      ports: {
        inputs: [
          {
            id: "relativePermittivity",
            label: "Relative Permittivity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "vacuumPermittivity",
            label: "Vacuum Permittivity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "area",
            label: "Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "thickness",
            label: "Thickness",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "capacitance",
            label: "Capacitance",
            valueType: { type: "number" },
          },
          {
            id: "capacitancePerArea",
            label: "Capacitance Per Area",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = membraneCapacitanceAreaThicknessFactorTool.execute;
export default membraneCapacitanceAreaThicknessFactorTool;
