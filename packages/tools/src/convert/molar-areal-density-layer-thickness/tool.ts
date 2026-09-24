import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly molesPerArea: number;
  readonly molarMass: number;
  readonly density: number;
};
export type Output = {
  readonly massPerArea: number;
  readonly thickness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    molesPerArea: { type: "number", minimum: 0 },
    molarMass: { type: "number", exclusiveMinimum: 0 },
    density: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["molesPerArea", "molarMass", "density"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massPerArea: { type: "number" },
    thickness: { type: "number" },
  },
  required: ["massPerArea", "thickness"],
} as const;
/** Calculate molar areal density layer thickness from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { molesPerArea, molarMass, density } = request;
  const compute = (): Output => {
    H.domain(molesPerArea >= 0);
    H.positive(molarMass);
    H.positive(density);
    return {
      massPerArea: molesPerArea * molarMass,
      thickness: (molesPerArea * molarMass) / density,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { molesPerArea: 2, molarMass: 3, density: 6 },
  output: { massPerArea: 6, thickness: 1 },
} satisfies ToolExample<Input, Output>;
export const molarArealDensityLayerThicknessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/molar-areal-density-layer-thickness",
    title: "Molar Areal Density Layer Thickness Tool",
    description:
      "Calculate molar areal density layer thickness from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        molesPerArea: { type: "number", minimum: 0 },
        molarMass: { type: "number", exclusiveMinimum: 0 },
        density: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["molesPerArea", "molarMass", "density"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massPerArea: { type: "number" },
        thickness: { type: "number" },
      },
      required: ["massPerArea", "thickness"],
    },
    ports: {
      inputs: [
        {
          id: "molesPerArea",
          label: "Moles Per Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "molarMass",
          label: "Molar Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "density",
          label: "Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "massPerArea",
          label: "Mass Per Area",
          valueType: { type: "number" },
        },
        { id: "thickness", label: "Thickness", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = molarArealDensityLayerThicknessTool.execute;
export default molarArealDensityLayerThicknessTool;
