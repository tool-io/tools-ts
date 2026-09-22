import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gravity: number;
  readonly coriolis: number;
  readonly relativeVorticity: number;
  readonly upperTheta: number;
  readonly lowerTheta: number;
  readonly pressureThickness: number;
};
export type Output = {
  readonly absoluteVorticity: number;
  readonly potentialVorticity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gravity: { type: "number", exclusiveMinimum: 0 },
    coriolis: { type: "number" },
    relativeVorticity: { type: "number" },
    upperTheta: { type: "number" },
    lowerTheta: { type: "number" },
    pressureThickness: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "gravity",
    "coriolis",
    "relativeVorticity",
    "upperTheta",
    "lowerTheta",
    "pressureThickness",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteVorticity: { type: "number" },
    potentialVorticity: { type: "number" },
  },
  required: ["absoluteVorticity", "potentialVorticity"],
} as const;
/** Hydrostatic vertical-vorticity layer approximation g*(f+zeta)*(thetaUpper-thetaLower)/(pLower-pUpper), excluding horizontal tilting terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    gravity,
    coriolis,
    relativeVorticity,
    upperTheta,
    lowerTheta,
    pressureThickness,
  } = request;
  const compute = (): Output => {
    H.positive(gravity);
    H.positive(pressureThickness);
    return {
      absoluteVorticity: coriolis + relativeVorticity,
      potentialVorticity:
        (gravity * (coriolis + relativeVorticity) * (upperTheta - lowerTheta)) /
        pressureThickness,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    gravity: 10,
    coriolis: 0.0001,
    relativeVorticity: 0.00002,
    upperTheta: 310,
    lowerTheta: 300,
    pressureThickness: 10000,
  },
  output: { absoluteVorticity: 0.00012, potentialVorticity: 0.0000012 },
} satisfies ToolExample<Input, Output>;
export const potentialVorticityOneLayerTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/potential-vorticity-one-layer-term",
    title: "Potential Vorticity One Layer Term Tool",
    description:
      "Hydrostatic vertical-vorticity layer approximation g*(f+zeta)*(thetaUpper-thetaLower)/(pLower-pUpper), excluding horizontal tilting terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gravity: { type: "number", exclusiveMinimum: 0 },
        coriolis: { type: "number" },
        relativeVorticity: { type: "number" },
        upperTheta: { type: "number" },
        lowerTheta: { type: "number" },
        pressureThickness: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "gravity",
        "coriolis",
        "relativeVorticity",
        "upperTheta",
        "lowerTheta",
        "pressureThickness",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absoluteVorticity: { type: "number" },
        potentialVorticity: { type: "number" },
      },
      required: ["absoluteVorticity", "potentialVorticity"],
    },
    ports: {
      inputs: [
        {
          id: "gravity",
          label: "Gravity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coriolis",
          label: "Coriolis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "relativeVorticity",
          label: "Relative Vorticity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperTheta",
          label: "Upper Theta",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerTheta",
          label: "Lower Theta",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pressureThickness",
          label: "Pressure Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "absoluteVorticity",
          label: "Absolute Vorticity",
          valueType: { type: "number" },
        },
        {
          id: "potentialVorticity",
          label: "Potential Vorticity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = potentialVorticityOneLayerTermTool.execute;
export default potentialVorticityOneLayerTermTool;
