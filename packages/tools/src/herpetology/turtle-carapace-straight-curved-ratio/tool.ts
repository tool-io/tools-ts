import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly straightLength: number;
  readonly curvedLength: number;
  readonly measurementUncertainty: number;
};
export type Output = {
  readonly ratio: number;
  readonly curvatureExcess: number;
  readonly relativeExcess: number;
  readonly uncertaintyFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    straightLength: { type: "number", exclusiveMinimum: 0 },
    curvedLength: { type: "number" },
    measurementUncertainty: { type: "number", minimum: 0 },
  },
  required: ["straightLength", "curvedLength", "measurementUncertainty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratio: { type: "number" },
    curvatureExcess: { type: "number" },
    relativeExcess: { type: "number" },
    uncertaintyFraction: { type: "number" },
  },
  required: [
    "ratio",
    "curvatureExcess",
    "relativeExcess",
    "uncertaintyFraction",
  ],
} as const;
/** Calculate turtle carapace straight curved ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { straightLength, curvedLength, measurementUncertainty } = request;
  const compute = (): Output => {
    H.positive(straightLength);
    H.domain(curvedLength >= straightLength && measurementUncertainty >= 0);
    return {
      ratio: curvedLength / straightLength,
      curvatureExcess: curvedLength - straightLength,
      relativeExcess: (curvedLength - straightLength) / straightLength,
      uncertaintyFraction: measurementUncertainty / straightLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { straightLength: 20, curvedLength: 24, measurementUncertainty: 0.5 },
  output: {
    ratio: 1.2,
    curvatureExcess: 4,
    relativeExcess: 0.2,
    uncertaintyFraction: 0.025,
  },
} satisfies ToolExample<Input, Output>;
export const turtleCarapaceStraightCurvedRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/turtle-carapace-straight-curved-ratio",
    title: "Turtle Carapace Straight Curved Ratio Tool",
    description:
      "Calculate turtle carapace straight curved ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        straightLength: { type: "number", exclusiveMinimum: 0 },
        curvedLength: { type: "number" },
        measurementUncertainty: { type: "number", minimum: 0 },
      },
      required: ["straightLength", "curvedLength", "measurementUncertainty"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratio: { type: "number" },
        curvatureExcess: { type: "number" },
        relativeExcess: { type: "number" },
        uncertaintyFraction: { type: "number" },
      },
      required: [
        "ratio",
        "curvatureExcess",
        "relativeExcess",
        "uncertaintyFraction",
      ],
    },
    ports: {
      inputs: [
        {
          id: "straightLength",
          label: "Straight Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "curvedLength",
          label: "Curved Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measurementUncertainty",
          label: "Measurement Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "curvatureExcess",
          label: "Curvature Excess",
          valueType: { type: "number" },
        },
        {
          id: "relativeExcess",
          label: "Relative Excess",
          valueType: { type: "number" },
        },
        {
          id: "uncertaintyFraction",
          label: "Uncertainty Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = turtleCarapaceStraightCurvedRatioTool.execute;
export default turtleCarapaceStraightCurvedRatioTool;
