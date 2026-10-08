import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentDensity: number;
  readonly currentDensityReferenceUnit: number;
  readonly electrodePotential: number;
  readonly referenceEquilibriumPotential: number;
};
export type Output = {
  readonly log10AbsoluteCurrentDensity: number;
  readonly overpotential: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentDensity: { type: "number" },
    currentDensityReferenceUnit: { type: "number", exclusiveMinimum: 0 },
    electrodePotential: { type: "number" },
    referenceEquilibriumPotential: { type: "number" },
  },
  required: [
    "currentDensity",
    "currentDensityReferenceUnit",
    "electrodePotential",
    "referenceEquilibriumPotential",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    log10AbsoluteCurrentDensity: { type: "number" },
    overpotential: { type: "number" },
  },
  required: ["log10AbsoluteCurrentDensity", "overpotential"],
} as const;
/** Build one Tafel point from explicit signed current density, positive reference unit and potential difference without fitting slope or selecting reference electrodes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    currentDensity,
    currentDensityReferenceUnit,
    electrodePotential,
    referenceEquilibriumPotential,
  } = request;
  const compute = (): Output => {
    H.domain(currentDensity !== 0, "currentDensity");
    (H.domain(
      Number.isFinite(currentDensityReferenceUnit) &&
        currentDensityReferenceUnit > 0,
      "currentDensityReferenceUnit",
    ),
      currentDensityReferenceUnit);
    return {
      log10AbsoluteCurrentDensity:
        Math.log10(Math.abs(currentDensity)) -
        Math.log10(currentDensityReferenceUnit),
      overpotential: electrodePotential - referenceEquilibriumPotential,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    currentDensity: 100,
    currentDensityReferenceUnit: 1,
    electrodePotential: 0.5,
    referenceEquilibriumPotential: 0.3,
  },
  output: { log10AbsoluteCurrentDensity: 2, overpotential: 0.2 },
} satisfies ToolExample<Input, Output>;
export const tafelPointOverpotentialCoordinateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/tafel-point-overpotential-coordinate",
    title: "Tafel Point Overpotential Coordinate Tool",
    description:
      "Build one Tafel point from explicit signed current density, positive reference unit and potential difference without fitting slope or selecting reference electrodes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentDensity: { type: "number" },
        currentDensityReferenceUnit: { type: "number", exclusiveMinimum: 0 },
        electrodePotential: { type: "number" },
        referenceEquilibriumPotential: { type: "number" },
      },
      required: [
        "currentDensity",
        "currentDensityReferenceUnit",
        "electrodePotential",
        "referenceEquilibriumPotential",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        log10AbsoluteCurrentDensity: { type: "number" },
        overpotential: { type: "number" },
      },
      required: ["log10AbsoluteCurrentDensity", "overpotential"],
    },
    ports: {
      inputs: [
        {
          id: "currentDensity",
          label: "Current Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentDensityReferenceUnit",
          label: "Current Density Reference Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "electrodePotential",
          label: "Electrode Potential",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceEquilibriumPotential",
          label: "Reference Equilibrium Potential",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "log10AbsoluteCurrentDensity",
          label: "Log10Absolute Current Density",
          valueType: { type: "number" },
        },
        {
          id: "overpotential",
          label: "Overpotential",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tafelPointOverpotentialCoordinateTool.execute;
export default tafelPointOverpotentialCoordinateTool;
