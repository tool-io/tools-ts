import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly force: number;
  readonly displacement: number;
  readonly thermalEnergy: number;
};
export type Output = { readonly work: number; readonly thermalUnits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    force: { type: "number" },
    displacement: { type: "number" },
    thermalEnergy: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["force", "displacement", "thermalEnergy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { work: { type: "number" }, thermalUnits: { type: "number" } },
  required: ["work", "thermalUnits"],
} as const;
/** Signed collinear mechanical work divided by a supplied thermal energy kB*T. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { force, displacement, thermalEnergy } = request;
  const compute = (): Output => {
    H.positive(thermalEnergy);
    return {
      work: force * displacement,
      thermalUnits: (force * displacement) / thermalEnergy,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { force: 4, displacement: 3, thermalEnergy: 2 },
  output: { work: 12, thermalUnits: 6 },
} satisfies ToolExample<Input, Output>;
export const molecularForceWorkThermalUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/molecular-force-work-thermal-unit",
    title: "Molecular Force Work Thermal Unit Tool",
    description:
      "Signed collinear mechanical work divided by a supplied thermal energy kB*T.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        force: { type: "number" },
        displacement: { type: "number" },
        thermalEnergy: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["force", "displacement", "thermalEnergy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        work: { type: "number" },
        thermalUnits: { type: "number" },
      },
      required: ["work", "thermalUnits"],
    },
    ports: {
      inputs: [
        {
          id: "force",
          label: "Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "displacement",
          label: "Displacement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thermalEnergy",
          label: "Thermal Energy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "work", label: "Work", valueType: { type: "number" } },
        {
          id: "thermalUnits",
          label: "Thermal Units",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = molecularForceWorkThermalUnitTool.execute;
export default molecularForceWorkThermalUnitTool;
