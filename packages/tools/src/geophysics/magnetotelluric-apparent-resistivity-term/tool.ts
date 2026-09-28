import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly impedanceReal: number;
  readonly impedanceImaginary: number;
  readonly angularFrequency: number;
  readonly permeability: number;
};
export type Output = {
  readonly apparentResistivity: number;
  readonly phaseRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    impedanceReal: { type: "number" },
    impedanceImaginary: { type: "number" },
    angularFrequency: { type: "number", exclusiveMinimum: 0 },
    permeability: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "impedanceReal",
    "impedanceImaginary",
    "angularFrequency",
    "permeability",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    apparentResistivity: { type: "number" },
    phaseRadians: { type: "number" },
  },
  required: ["apparentResistivity", "phaseRadians"],
} as const;
/** Scalar apparent resistivity |Z|²/(mu*omega) for supplied E/H impedance in ohms, angular frequency in rad/s and permeability in H/m. Phase uses atan2 and zero impedance is rejected; this does not invert an Earth conductivity model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { impedanceReal, impedanceImaginary, angularFrequency, permeability } =
    request;
  const compute = (): Output => {
    H.positive(angularFrequency);
    H.positive(permeability);
    H.domain(
      impedanceReal !== 0 || impedanceImaginary !== 0,
      "impedanceReal",
      "A zero complex impedance has no defined phase.",
    );
    const scale = Math.sqrt(permeability) * Math.sqrt(angularFrequency);
    return {
      apparentResistivity:
        Math.hypot(impedanceReal / scale, impedanceImaginary / scale) ** 2,
      phaseRadians: Math.atan2(impedanceImaginary, impedanceReal),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    impedanceReal: 0.01,
    impedanceImaginary: 0.01,
    angularFrequency: 6.283185307179586,
    permeability: 0.0000012566370614359173,
  },
  output: {
    apparentResistivity: 25.330295910584454,
    phaseRadians: 0.7853981633974483,
  },
} satisfies ToolExample<Input, Output>;
export const magnetotelluricApparentResistivityTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geophysics/magnetotelluric-apparent-resistivity-term",
      title: "Magnetotelluric Apparent Resistivity Term Tool",
      description:
        "Scalar apparent resistivity |Z|²/(mu*omega) for supplied E/H impedance in ohms, angular frequency in rad/s and permeability in H/m. Phase uses atan2 and zero impedance is rejected; this does not invert an Earth conductivity model.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          impedanceReal: { type: "number" },
          impedanceImaginary: { type: "number" },
          angularFrequency: { type: "number", exclusiveMinimum: 0 },
          permeability: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "impedanceReal",
          "impedanceImaginary",
          "angularFrequency",
          "permeability",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          apparentResistivity: { type: "number" },
          phaseRadians: { type: "number" },
        },
        required: ["apparentResistivity", "phaseRadians"],
      },
      ports: {
        inputs: [
          {
            id: "impedanceReal",
            label: "Impedance Real",
            required: true,
            valueType: { type: "number", unit: "ohm" },
          },
          {
            id: "impedanceImaginary",
            label: "Impedance Imaginary",
            required: true,
            valueType: { type: "number", unit: "ohm" },
          },
          {
            id: "angularFrequency",
            label: "Angular Frequency",
            required: true,
            valueType: { type: "number", unit: "rad/s" },
          },
          {
            id: "permeability",
            label: "Permeability",
            required: true,
            valueType: { type: "number", unit: "H/m" },
          },
        ],
        outputs: [
          {
            id: "apparentResistivity",
            label: "Apparent Resistivity",
            valueType: { type: "number", unit: "ohm*m" },
          },
          {
            id: "phaseRadians",
            label: "Phase Radians",
            valueType: { type: "number", unit: "rad" },
          },
        ],
      },
    },
    calculate,
  });
export const run = magnetotelluricApparentResistivityTermTool.execute;
export default magnetotelluricApparentResistivityTermTool;
