import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPosition: number;
  readonly secondPosition: number;
  readonly suppliedRadiansPerUnit: number;
};
export type Output = {
  readonly stepRadians: number;
  readonly stepDegrees: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPosition: { type: "number" },
    secondPosition: { type: "number" },
    suppliedRadiansPerUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstPosition", "secondPosition", "suppliedRadiansPerUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stepRadians: { type: "number" },
    stepDegrees: { type: "number" },
  },
  required: ["stepRadians", "stepDegrees"],
} as const;
/** Convert a supplied research stimulus coordinate step under an explicit angular calibration, without an acuity interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPosition, secondPosition, suppliedRadiansPerUnit } = request;
  const compute = (): Output => {
    H.positive(suppliedRadiansPerUnit);
    return {
      stepRadians: (secondPosition - firstPosition) * suppliedRadiansPerUnit,
      stepDegrees:
        ((secondPosition - firstPosition) * suppliedRadiansPerUnit * 180) /
        Math.PI,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstPosition: 0,
    secondPosition: 2,
    suppliedRadiansPerUnit: 0.017453292519943295,
  },
  output: { stepRadians: 0.03490658503988659, stepDegrees: 2 },
} satisfies ToolExample<Input, Output>;
export const visualStimulusAngularStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/visual-stimulus-angular-step",
    title: "Visual Stimulus Angular Step Tool",
    description:
      "Convert a supplied research stimulus coordinate step under an explicit angular calibration, without an acuity interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPosition: { type: "number" },
        secondPosition: { type: "number" },
        suppliedRadiansPerUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstPosition", "secondPosition", "suppliedRadiansPerUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stepRadians: { type: "number" },
        stepDegrees: { type: "number" },
      },
      required: ["stepRadians", "stepDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "firstPosition",
          label: "First Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondPosition",
          label: "Second Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRadiansPerUnit",
          label: "Supplied Radians Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "stepRadians",
          label: "Step Radians",
          valueType: { type: "number" },
        },
        {
          id: "stepDegrees",
          label: "Step Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = visualStimulusAngularStepTool.execute;
export default visualStimulusAngularStepTool;
