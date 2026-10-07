import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly dihedralDegrees: number };
export type Output = { readonly wrappedDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dihedralDegrees: { type: "number" } },
  required: ["dihedralDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wrappedDegrees: { type: "number" } },
  required: ["wrappedDegrees"],
} as const;
/** Wrap a supplied dihedral angle in degrees to the half-open interval from -180 to 180. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dihedralDegrees } = request;
  const compute = (): Output => {
    return {
      wrappedDegrees:
        (((((dihedralDegrees % 360) + 180) % 360) + 360) % 360) - 180,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dihedralDegrees: 370 },
  output: { wrappedDegrees: 10 },
} satisfies ToolExample<Input, Output>;
export const internalCoordinateDihedralPeriodWrapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "computational-chemistry",
          "computational chemistry",
          "chemistry",
        ],
        keywords: ["computational chemistry", "chemistry"],
      },
      id: "computational-chemistry/internal-coordinate-dihedral-period-wrap",
      title: "Internal Coordinate Dihedral Period Wrap",
      description:
        "Wrap a supplied dihedral angle in degrees to the half-open interval from -180 to 180.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { dihedralDegrees: { type: "number" } },
        required: ["dihedralDegrees"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { wrappedDegrees: { type: "number" } },
        required: ["wrappedDegrees"],
      },
      ports: {
        inputs: [
          {
            id: "dihedralDegrees",
            label: "Dihedral Degrees",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "wrappedDegrees",
            label: "Wrapped Degrees",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = internalCoordinateDihedralPeriodWrapTool.execute;
export default internalCoordinateDihedralPeriodWrapTool;
