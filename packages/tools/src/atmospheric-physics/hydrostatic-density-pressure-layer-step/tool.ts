import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly basePressure: number;
  readonly density: number;
  readonly gravity: number;
  readonly upwardThickness: number;
};
export type Output = {
  readonly pressureChange: number;
  readonly topPressure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basePressure: { type: "number", minimum: 0 },
    density: { type: "number", minimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
    upwardThickness: { type: "number", minimum: 0 },
  },
  required: ["basePressure", "density", "gravity", "upwardThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressureChange: { type: "number" },
    topPressure: { type: "number" },
  },
  required: ["pressureChange", "topPressure"],
} as const;
/** Calculate hydrostatic density pressure layer step from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { basePressure, density, gravity, upwardThickness } = request;
  const compute = (): Output => {
    H.domain(
      basePressure >= 0 &&
        density >= 0 &&
        upwardThickness >= 0 &&
        basePressure >= density * gravity * upwardThickness,
    );
    H.positive(gravity);
    return {
      pressureChange: -density * gravity * upwardThickness,
      topPressure: basePressure - density * gravity * upwardThickness,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    basePressure: 100000,
    density: 1,
    gravity: 10,
    upwardThickness: 100,
  },
  output: { pressureChange: -1000, topPressure: 99000 },
} satisfies ToolExample<Input, Output>;
export const hydrostaticDensityPressureLayerStepTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-physics/hydrostatic-density-pressure-layer-step",
      title: "Hydrostatic Density Pressure Layer Step Tool",
      description:
        "Calculate hydrostatic density pressure layer step from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          basePressure: { type: "number", minimum: 0 },
          density: { type: "number", minimum: 0 },
          gravity: { type: "number", exclusiveMinimum: 0 },
          upwardThickness: { type: "number", minimum: 0 },
        },
        required: ["basePressure", "density", "gravity", "upwardThickness"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pressureChange: { type: "number" },
          topPressure: { type: "number" },
        },
        required: ["pressureChange", "topPressure"],
      },
      ports: {
        inputs: [
          {
            id: "basePressure",
            label: "Base Pressure",
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
            id: "upwardThickness",
            label: "Upward Thickness",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "pressureChange",
            label: "Pressure Change",
            valueType: { type: "number" },
          },
          {
            id: "topPressure",
            label: "Top Pressure",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hydrostaticDensityPressureLayerStepTool.execute;
export default hydrostaticDensityPressureLayerStepTool;
