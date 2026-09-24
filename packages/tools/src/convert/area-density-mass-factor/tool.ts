import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly arealMassDensity: number;
  readonly suppliedAreaUnitFactor: number;
  readonly suppliedDensityUnitFactor: number;
};
export type Output = { readonly mass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    arealMassDensity: { type: "number", minimum: 0 },
    suppliedAreaUnitFactor: { type: "number", exclusiveMinimum: 0 },
    suppliedDensityUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "area",
    "arealMassDensity",
    "suppliedAreaUnitFactor",
    "suppliedDensityUnitFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mass: { type: "number" } },
  required: ["mass"],
} as const;
/** Multiply supplied area and areal mass density after explicit compatible unit normalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    area,
    arealMassDensity,
    suppliedAreaUnitFactor,
    suppliedDensityUnitFactor,
  } = request;
  const compute = (): Output => {
    H.domain(area >= 0 && arealMassDensity >= 0);
    H.positive(suppliedAreaUnitFactor);
    H.positive(suppliedDensityUnitFactor);
    return {
      mass:
        area *
        suppliedAreaUnitFactor *
        arealMassDensity *
        suppliedDensityUnitFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    area: 20,
    arealMassDensity: 3,
    suppliedAreaUnitFactor: 0.5,
    suppliedDensityUnitFactor: 2,
  },
  output: { mass: 60 },
} satisfies ToolExample<Input, Output>;
export const areaDensityMassFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/area-density-mass-factor",
    title: "Area Density Mass Factor Tool",
    description:
      "Multiply supplied area and areal mass density after explicit compatible unit normalization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        arealMassDensity: { type: "number", minimum: 0 },
        suppliedAreaUnitFactor: { type: "number", exclusiveMinimum: 0 },
        suppliedDensityUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "area",
        "arealMassDensity",
        "suppliedAreaUnitFactor",
        "suppliedDensityUnitFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mass: { type: "number" } },
      required: ["mass"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "arealMassDensity",
          label: "Areal Mass Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedAreaUnitFactor",
          label: "Supplied Area Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDensityUnitFactor",
          label: "Supplied Density Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "mass", label: "Mass", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = areaDensityMassFactorTool.execute;
export default areaDensityMassFactorTool;
