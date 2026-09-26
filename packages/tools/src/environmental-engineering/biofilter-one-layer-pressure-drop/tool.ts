import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly viscousCoefficient: number;
  readonly inertialCoefficient: number;
  readonly velocity: number;
  readonly depth: number;
};
export type Output = {
  readonly viscousDrop: number;
  readonly inertialDrop: number;
  readonly totalDrop: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    viscousCoefficient: { type: "number", minimum: 0 },
    inertialCoefficient: { type: "number", minimum: 0 },
    velocity: { type: "number" },
    depth: { type: "number", minimum: 0 },
  },
  required: ["viscousCoefficient", "inertialCoefficient", "velocity", "depth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    viscousDrop: { type: "number" },
    inertialDrop: { type: "number" },
    totalDrop: { type: "number" },
  },
  required: ["viscousDrop", "inertialDrop", "totalDrop"],
} as const;
/** One-layer Darcy-Forchheimer pressure drop with explicitly supplied dimensional coefficients and signed superficial velocity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { viscousCoefficient, inertialCoefficient, velocity, depth } = request;
  const compute = (): Output => {
    H.domain(viscousCoefficient >= 0 && inertialCoefficient >= 0 && depth >= 0);
    return {
      viscousDrop: viscousCoefficient * velocity * depth,
      inertialDrop: inertialCoefficient * velocity * Math.abs(velocity) * depth,
      totalDrop:
        (viscousCoefficient * velocity +
          inertialCoefficient * velocity * Math.abs(velocity)) *
        depth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    viscousCoefficient: 10,
    inertialCoefficient: 2,
    velocity: 3,
    depth: 0.5,
  },
  output: { viscousDrop: 15, inertialDrop: 9, totalDrop: 24 },
} satisfies ToolExample<Input, Output>;
export const biofilterOneLayerPressureDropTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/biofilter-one-layer-pressure-drop",
    title: "Biofilter One Layer Pressure Drop Tool",
    description:
      "One-layer Darcy-Forchheimer pressure drop with explicitly supplied dimensional coefficients and signed superficial velocity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        viscousCoefficient: { type: "number", minimum: 0 },
        inertialCoefficient: { type: "number", minimum: 0 },
        velocity: { type: "number" },
        depth: { type: "number", minimum: 0 },
      },
      required: [
        "viscousCoefficient",
        "inertialCoefficient",
        "velocity",
        "depth",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        viscousDrop: { type: "number" },
        inertialDrop: { type: "number" },
        totalDrop: { type: "number" },
      },
      required: ["viscousDrop", "inertialDrop", "totalDrop"],
    },
    ports: {
      inputs: [
        {
          id: "viscousCoefficient",
          label: "Viscous Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inertialCoefficient",
          label: "Inertial Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "velocity",
          label: "Velocity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "viscousDrop",
          label: "Viscous Drop",
          valueType: { type: "number" },
        },
        {
          id: "inertialDrop",
          label: "Inertial Drop",
          valueType: { type: "number" },
        },
        { id: "totalDrop", label: "Total Drop", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = biofilterOneLayerPressureDropTool.execute;
export default biofilterOneLayerPressureDropTool;
