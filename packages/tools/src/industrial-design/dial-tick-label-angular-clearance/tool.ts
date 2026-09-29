import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly arcPitchRadians: number;
  readonly labelWidth: number;
};
export type Output = {
  readonly arcSpacing: number;
  readonly clearance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", minimum: 0 },
    arcPitchRadians: { type: "number", minimum: 0 },
    labelWidth: { type: "number", minimum: 0 },
  },
  required: ["radius", "arcPitchRadians", "labelWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { arcSpacing: { type: "number" }, clearance: { type: "number" } },
  required: ["arcSpacing", "clearance"],
} as const;
/** Calculate dial tick label angular clearance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, arcPitchRadians, labelWidth } = request;
  const compute = (): Output => {
    H.domain(radius >= 0 && arcPitchRadians >= 0 && labelWidth >= 0);
    return {
      arcSpacing: radius * arcPitchRadians,
      clearance: radius * arcPitchRadians - labelWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 50, arcPitchRadians: 0.2, labelWidth: 6 },
  output: { arcSpacing: 10, clearance: 4 },
} satisfies ToolExample<Input, Output>;
export const dialTickLabelAngularClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/dial-tick-label-angular-clearance",
    title: "Dial Tick Label Angular Clearance Tool",
    description:
      "Calculate dial tick label angular clearance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", minimum: 0 },
        arcPitchRadians: { type: "number", minimum: 0 },
        labelWidth: { type: "number", minimum: 0 },
      },
      required: ["radius", "arcPitchRadians", "labelWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arcSpacing: { type: "number" },
        clearance: { type: "number" },
      },
      required: ["arcSpacing", "clearance"],
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
          id: "arcPitchRadians",
          label: "Arc Pitch Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labelWidth",
          label: "Label Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "arcSpacing",
          label: "Arc Spacing",
          valueType: { type: "number" },
        },
        { id: "clearance", label: "Clearance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dialTickLabelAngularClearanceTool.execute;
export default dialTickLabelAngularClearanceTool;
