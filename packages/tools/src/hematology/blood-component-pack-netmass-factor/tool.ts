import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly emptyPackMass: number;
  readonly density: number;
};
export type Output = {
  readonly netMass: number;
  readonly estimatedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number" },
    emptyPackMass: { type: "number", minimum: 0 },
    density: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["grossMass", "emptyPackMass", "density"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netMass: { type: "number" },
    estimatedVolume: { type: "number" },
  },
  required: ["netMass", "estimatedVolume"],
} as const;
/** Container-tare mass and caller-supplied-density volume estimate, without product specification or transfusion guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, emptyPackMass, density } = request;
  const compute = (): Output => {
    H.domain(grossMass >= emptyPackMass && emptyPackMass >= 0);
    H.positive(density);
    return {
      netMass: grossMass - emptyPackMass,
      estimatedVolume: (grossMass - emptyPackMass) / density,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossMass: 320, emptyPackMass: 20, density: 1.05 },
  output: { netMass: 300, estimatedVolume: 285.7142857142857 },
} satisfies ToolExample<Input, Output>;
export const bloodComponentPackNetmassFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/blood-component-pack-netmass-factor",
    title: "Blood Component Pack Netmass Factor Tool",
    description:
      "Container-tare mass and caller-supplied-density volume estimate, without product specification or transfusion guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMass: { type: "number" },
        emptyPackMass: { type: "number", minimum: 0 },
        density: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["grossMass", "emptyPackMass", "density"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netMass: { type: "number" },
        estimatedVolume: { type: "number" },
      },
      required: ["netMass", "estimatedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "grossMass",
          label: "Gross Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "emptyPackMass",
          label: "Empty Pack Mass",
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
        { id: "netMass", label: "Net Mass", valueType: { type: "number" } },
        {
          id: "estimatedVolume",
          label: "Estimated Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bloodComponentPackNetmassFactorTool.execute;
export default bloodComponentPackNetmassFactorTool;
