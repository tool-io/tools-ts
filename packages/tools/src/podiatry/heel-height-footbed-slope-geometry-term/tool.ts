import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly heelHeight: number;
  readonly forefootHeight: number;
  readonly horizontalRun: number;
};
export type Output = {
  readonly rise: number;
  readonly slope: number;
  readonly angleRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heelHeight: { type: "number", minimum: 0 },
    forefootHeight: { type: "number", minimum: 0 },
    horizontalRun: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["heelHeight", "forefootHeight", "horizontalRun"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rise: { type: "number" },
    slope: { type: "number" },
    angleRadians: { type: "number" },
  },
  required: ["rise", "slope", "angleRadians"],
} as const;
/** Calculate heel height footbed slope geometry term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { heelHeight, forefootHeight, horizontalRun } = request;
  const compute = (): Output => {
    H.positive(horizontalRun);
    H.domain(heelHeight >= 0 && forefootHeight >= 0);
    return {
      rise: heelHeight - forefootHeight,
      slope: (heelHeight - forefootHeight) / horizontalRun,
      angleRadians: Math.atan2(heelHeight - forefootHeight, horizontalRun),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { heelHeight: 30, forefootHeight: 10, horizontalRun: 200 },
  output: { rise: 20, slope: 0.1, angleRadians: 0.09966865249116204 },
} satisfies ToolExample<Input, Output>;
export const heelHeightFootbedSlopeGeometryTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "podiatry/heel-height-footbed-slope-geometry-term",
    title: "Heel Height Footbed Slope Geometry Term Tool",
    description:
      "Calculate heel height footbed slope geometry term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heelHeight: { type: "number", minimum: 0 },
        forefootHeight: { type: "number", minimum: 0 },
        horizontalRun: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["heelHeight", "forefootHeight", "horizontalRun"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rise: { type: "number" },
        slope: { type: "number" },
        angleRadians: { type: "number" },
      },
      required: ["rise", "slope", "angleRadians"],
    },
    ports: {
      inputs: [
        {
          id: "heelHeight",
          label: "Heel Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "forefootHeight",
          label: "Forefoot Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "horizontalRun",
          label: "Horizontal Run",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rise", label: "Rise", valueType: { type: "number" } },
        { id: "slope", label: "Slope", valueType: { type: "number" } },
        {
          id: "angleRadians",
          label: "Angle Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = heelHeightFootbedSlopeGeometryTermTool.execute;
export default heelHeightFootbedSlopeGeometryTermTool;
