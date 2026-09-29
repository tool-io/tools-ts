import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reflectivityDbz: number;
  readonly coefficientA: number;
  readonly exponentB: number;
};
export type Output = {
  readonly linearReflectivity: number;
  readonly rainRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reflectivityDbz: { type: "number" },
    coefficientA: { type: "number", exclusiveMinimum: 0 },
    exponentB: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["reflectivityDbz", "coefficientA", "exponentB"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linearReflectivity: { type: "number" },
    rainRate: { type: "number" },
  },
  required: ["linearReflectivity", "rainRate"],
} as const;
/** Invert caller-calibrated Z=a*R^b after converting dBZ to linear Z; no universal precipitation regime is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reflectivityDbz, coefficientA, exponentB } = request;
  const compute = (): Output => {
    H.positive(coefficientA);
    H.positive(exponentB);
    return {
      linearReflectivity: 10 ** (reflectivityDbz / 10),
      rainRate:
        (10 ** (reflectivityDbz / 10) / coefficientA) ** (1 / exponentB),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reflectivityDbz: 30, coefficientA: 250, exponentB: 1.5 },
  output: { linearReflectivity: 1000, rainRate: 2.5198420997897464 },
} satisfies ToolExample<Input, Output>;
export const radarRainRateSuppliedZrPointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/radar-rain-rate-supplied-zr-point",
    title: "Radar Rain Rate Supplied Zr Point Tool",
    description:
      "Invert caller-calibrated Z=a*R^b after converting dBZ to linear Z; no universal precipitation regime is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reflectivityDbz: { type: "number" },
        coefficientA: { type: "number", exclusiveMinimum: 0 },
        exponentB: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["reflectivityDbz", "coefficientA", "exponentB"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linearReflectivity: { type: "number" },
        rainRate: { type: "number" },
      },
      required: ["linearReflectivity", "rainRate"],
    },
    ports: {
      inputs: [
        {
          id: "reflectivityDbz",
          label: "Reflectivity Dbz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coefficientA",
          label: "Coefficient A",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exponentB",
          label: "Exponent B",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "linearReflectivity",
          label: "Linear Reflectivity",
          valueType: { type: "number" },
        },
        { id: "rainRate", label: "Rain Rate", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = radarRainRateSuppliedZrPointTool.execute;
export default radarRainRateSuppliedZrPointTool;
