import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly angleRadians: number;
  readonly moduleWidth: number;
};
export type Output = {
  readonly arcLength: number;
  readonly completeModules: number;
  readonly remainder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", minimum: 0 },
    angleRadians: { type: "number", minimum: 0 },
    moduleWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["radius", "angleRadians", "moduleWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arcLength: { type: "number" },
    completeModules: { type: "integer" },
    remainder: { type: "number" },
  },
  required: ["arcLength", "completeModules", "remainder"],
} as const;
/** Calculate paver fan wedge module gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, angleRadians, moduleWidth } = request;
  const compute = (): Output => {
    H.domain(radius >= 0 && angleRadians >= 0);
    H.positive(moduleWidth);
    return {
      arcLength: radius * angleRadians,
      completeModules: Math.floor((radius * angleRadians) / moduleWidth),
      remainder:
        radius * angleRadians -
        Math.floor((radius * angleRadians) / moduleWidth) * moduleWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 10, angleRadians: 0.5, moduleWidth: 2 },
  output: { arcLength: 5, completeModules: 2, remainder: 1 },
} satisfies ToolExample<Input, Output>;
export const paverFanWedgeModuleGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/paver-fan-wedge-module-gap",
    title: "Paver Fan Wedge Module Gap Tool",
    description:
      "Calculate paver fan wedge module gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", minimum: 0 },
        angleRadians: { type: "number", minimum: 0 },
        moduleWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["radius", "angleRadians", "moduleWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arcLength: { type: "number" },
        completeModules: { type: "integer" },
        remainder: { type: "number" },
      },
      required: ["arcLength", "completeModules", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "moduleWidth",
          label: "Module Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "arcLength", label: "Arc Length", valueType: { type: "number" } },
        {
          id: "completeModules",
          label: "Complete Modules",
          valueType: { type: "integer" },
        },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = paverFanWedgeModuleGapTool.execute;
export default paverFanWedgeModuleGapTool;
