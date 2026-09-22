import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly depth: number;
  readonly density: number;
  readonly gravity: number;
  readonly referencePressure: number;
};
export type Output = {
  readonly gaugePressure: number;
  readonly absolutePressure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depth: { type: "number", minimum: 0 },
    density: { type: "number", exclusiveMinimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
    referencePressure: { type: "number", minimum: 0 },
  },
  required: ["depth", "density", "gravity", "referencePressure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gaugePressure: { type: "number" },
    absolutePressure: { type: "number" },
  },
  required: ["gaugePressure", "absolutePressure"],
} as const;
/** Constant-density hydrostatic approximation in SI units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { depth, density, gravity, referencePressure } = request;
  const compute = (): Output => {
    H.domain(depth >= 0 && referencePressure >= 0);
    H.positive(density);
    H.positive(gravity);
    return {
      gaugePressure: depth * density * gravity,
      absolutePressure: referencePressure + depth * density * gravity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { depth: 10, density: 1000, gravity: 10, referencePressure: 100000 },
  output: { gaugePressure: 100000, absolutePressure: 200000 },
} satisfies ToolExample<Input, Output>;
export const aquaticSampleDepthPressureReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquatic-science/aquatic-sample-depth-pressure-reference",
      title: "Aquatic Sample Depth Pressure Reference Tool",
      description: "Constant-density hydrostatic approximation in SI units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          depth: { type: "number", minimum: 0 },
          density: { type: "number", exclusiveMinimum: 0 },
          gravity: { type: "number", exclusiveMinimum: 0 },
          referencePressure: { type: "number", minimum: 0 },
        },
        required: ["depth", "density", "gravity", "referencePressure"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gaugePressure: { type: "number" },
          absolutePressure: { type: "number" },
        },
        required: ["gaugePressure", "absolutePressure"],
      },
      ports: {
        inputs: [
          {
            id: "depth",
            label: "Depth",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "density",
            label: "Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "gravity",
            label: "Gravity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referencePressure",
            label: "Reference Pressure",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "gaugePressure",
            label: "Gauge Pressure",
            valueType: { type: "number" },
          },
          {
            id: "absolutePressure",
            label: "Absolute Pressure",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = aquaticSampleDepthPressureReferenceTool.execute;
export default aquaticSampleDepthPressureReferenceTool;
