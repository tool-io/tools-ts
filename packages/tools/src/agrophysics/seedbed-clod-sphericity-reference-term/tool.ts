import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volume: number;
  readonly measuredSurface: number;
};
export type Output = {
  readonly equivalentSphereArea: number;
  readonly sphericity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number", exclusiveMinimum: 0 },
    measuredSurface: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["volume", "measuredSurface"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalentSphereArea: { type: "number" },
    sphericity: { type: "number" },
  },
  required: ["equivalentSphereArea", "sphericity"],
} as const;
/** Wadell surface sphericity: area of the equal-volume sphere divided by measured clod surface, in consistent units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volume, measuredSurface } = request;
  const compute = (): Output => {
    H.positive(volume);
    H.positive(measuredSurface);
    const equivalentSphereArea =
      Math.cbrt(36 * Math.PI) * Math.cbrt(volume) ** 2;
    H.domain(measuredSurface >= equivalentSphereArea);
    return {
      equivalentSphereArea,
      sphericity: equivalentSphereArea / measuredSurface,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volume: 1, measuredSurface: 6 },
  output: {
    equivalentSphereArea: 4.835975862049409,
    sphericity: 0.8059959770082349,
  },
} satisfies ToolExample<Input, Output>;
export const seedbedClodSphericityReferenceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/seedbed-clod-sphericity-reference-term",
    title: "Seedbed Clod Sphericity Reference Term Tool",
    description:
      "Wadell surface sphericity: area of the equal-volume sphere divided by measured clod surface, in consistent units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volume: { type: "number", exclusiveMinimum: 0 },
        measuredSurface: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["volume", "measuredSurface"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equivalentSphereArea: { type: "number" },
        sphericity: { type: "number" },
      },
      required: ["equivalentSphereArea", "sphericity"],
    },
    ports: {
      inputs: [
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredSurface",
          label: "Measured Surface",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equivalentSphereArea",
          label: "Equivalent Sphere Area",
          valueType: { type: "number" },
        },
        {
          id: "sphericity",
          label: "Sphericity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seedbedClodSphericityReferenceTermTool.execute;
export default seedbedClodSphericityReferenceTermTool;
