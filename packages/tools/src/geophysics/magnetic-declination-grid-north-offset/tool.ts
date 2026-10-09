import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly magneticBearingDegrees: number;
  readonly suppliedMagneticToTrueDegrees: number;
  readonly suppliedTrueToGridDegrees: number;
};
export type Output = { readonly gridBearingDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    magneticBearingDegrees: { type: "number" },
    suppliedMagneticToTrueDegrees: { type: "number" },
    suppliedTrueToGridDegrees: { type: "number" },
  },
  required: [
    "magneticBearingDegrees",
    "suppliedMagneticToTrueDegrees",
    "suppliedTrueToGridDegrees",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gridBearingDegrees: { type: "number" } },
  required: ["gridBearingDegrees"],
} as const;
/** Add explicit clockwise-positive magnetic-to-true and true-to-grid bearing offsets and wrap to [0,360) without a magnetic model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    magneticBearingDegrees,
    suppliedMagneticToTrueDegrees,
    suppliedTrueToGridDegrees,
  } = request;
  const compute = (): Output => {
    return (() => {
      const raw =
        (magneticBearingDegrees % 360) +
        (suppliedMagneticToTrueDegrees % 360) +
        (suppliedTrueToGridDegrees % 360);
      return { gridBearingDegrees: ((raw % 360) + 360) % 360 };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    magneticBearingDegrees: 350,
    suppliedMagneticToTrueDegrees: 5,
    suppliedTrueToGridDegrees: 10,
  },
  output: { gridBearingDegrees: 5 },
} satisfies ToolExample<Input, Output>;
export const magneticDeclinationGridNorthOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/magnetic-declination-grid-north-offset",
    title: "Magnetic Declination Grid North Offset Tool",
    description:
      "Add explicit clockwise-positive magnetic-to-true and true-to-grid bearing offsets and wrap to [0,360) without a magnetic model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        magneticBearingDegrees: { type: "number" },
        suppliedMagneticToTrueDegrees: { type: "number" },
        suppliedTrueToGridDegrees: { type: "number" },
      },
      required: [
        "magneticBearingDegrees",
        "suppliedMagneticToTrueDegrees",
        "suppliedTrueToGridDegrees",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gridBearingDegrees: { type: "number" } },
      required: ["gridBearingDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "magneticBearingDegrees",
          label: "Magnetic Bearing Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedMagneticToTrueDegrees",
          label: "Supplied Magnetic To True Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTrueToGridDegrees",
          label: "Supplied True To Grid Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "gridBearingDegrees",
          label: "Grid Bearing Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = magneticDeclinationGridNorthOffsetTool.execute;
export default magneticDeclinationGridNorthOffsetTool;
