import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly axialStretch: number;
  readonly initialWidth: number;
  readonly initialThickness: number;
};
export type Output = {
  readonly lateralStretch: number;
  readonly finalWidth: number;
  readonly finalThickness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axialStretch: { type: "number", exclusiveMinimum: 0 },
    initialWidth: { type: "number", minimum: 0 },
    initialThickness: { type: "number", minimum: 0 },
  },
  required: ["axialStretch", "initialWidth", "initialThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lateralStretch: { type: "number" },
    finalWidth: { type: "number" },
    finalThickness: { type: "number" },
  },
  required: ["lateralStretch", "finalWidth", "finalThickness"],
} as const;
/** Ideal isotropic incompressible uniaxial deformation, with equal transverse stretches. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { axialStretch, initialWidth, initialThickness } = request;
  const compute = (): Output => {
    H.positive(axialStretch);
    H.domain(initialWidth >= 0 && initialThickness >= 0);
    return {
      lateralStretch: 1 / Math.sqrt(axialStretch),
      finalWidth: initialWidth / Math.sqrt(axialStretch),
      finalThickness: initialThickness / Math.sqrt(axialStretch),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { axialStretch: 4, initialWidth: 10, initialThickness: 2 },
  output: { lateralStretch: 0.5, finalWidth: 5, finalThickness: 1 },
} satisfies ToolExample<Input, Output>;
export const elastomerUniaxialStretchLateralFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioengineering/elastomer-uniaxial-stretch-lateral-factor",
      title: "Elastomer Uniaxial Stretch Lateral Factor Tool",
      description:
        "Ideal isotropic incompressible uniaxial deformation, with equal transverse stretches.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          axialStretch: { type: "number", exclusiveMinimum: 0 },
          initialWidth: { type: "number", minimum: 0 },
          initialThickness: { type: "number", minimum: 0 },
        },
        required: ["axialStretch", "initialWidth", "initialThickness"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lateralStretch: { type: "number" },
          finalWidth: { type: "number" },
          finalThickness: { type: "number" },
        },
        required: ["lateralStretch", "finalWidth", "finalThickness"],
      },
      ports: {
        inputs: [
          {
            id: "axialStretch",
            label: "Axial Stretch",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialWidth",
            label: "Initial Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialThickness",
            label: "Initial Thickness",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "lateralStretch",
            label: "Lateral Stretch",
            valueType: { type: "number" },
          },
          {
            id: "finalWidth",
            label: "Final Width",
            valueType: { type: "number" },
          },
          {
            id: "finalThickness",
            label: "Final Thickness",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = elastomerUniaxialStretchLateralFactorTool.execute;
export default elastomerUniaxialStretchLateralFactorTool;
