import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerDiameter: number;
  readonly upperDiameter: number;
};
export type Output = { readonly midpoint: number; readonly logWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerDiameter: { type: "number", exclusiveMinimum: 0 },
    upperDiameter: { type: "number" },
  },
  required: ["lowerDiameter", "upperDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { midpoint: { type: "number" }, logWidth: { type: "number" } },
  required: ["midpoint", "logWidth"],
} as const;
/** Calculate particle size bin geometric midpoint from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerDiameter, upperDiameter } = request;
  const compute = (): Output => {
    H.positive(lowerDiameter);
    H.domain(upperDiameter >= lowerDiameter);
    return {
      midpoint: Math.sqrt(lowerDiameter) * Math.sqrt(upperDiameter),
      logWidth: Math.log(upperDiameter / lowerDiameter),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerDiameter: 1, upperDiameter: 9 },
  output: { midpoint: 3, logWidth: 2.1972245773362196 },
} satisfies ToolExample<Input, Output>;
export const particleSizeBinGeometricMidpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/particle-size-bin-geometric-midpoint",
    title: "Particle Size Bin Geometric Midpoint Tool",
    description:
      "Calculate particle size bin geometric midpoint from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerDiameter: { type: "number", exclusiveMinimum: 0 },
        upperDiameter: { type: "number" },
      },
      required: ["lowerDiameter", "upperDiameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midpoint: { type: "number" },
        logWidth: { type: "number" },
      },
      required: ["midpoint", "logWidth"],
    },
    ports: {
      inputs: [
        {
          id: "lowerDiameter",
          label: "Lower Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperDiameter",
          label: "Upper Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
        { id: "logWidth", label: "Log Width", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = particleSizeBinGeometricMidpointTool.execute;
export default particleSizeBinGeometricMidpointTool;
