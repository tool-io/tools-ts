import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arcRadians: number;
  readonly fullTurnRadians: number;
};
export type Output = {
  readonly relativeSign: number;
  readonly halfway: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arcRadians: { type: "number", minimum: 0 },
    fullTurnRadians: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["arcRadians", "fullTurnRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeSign: { type: "integer" },
    halfway: { type: "boolean" },
  },
  required: ["relativeSign", "halfway"],
} as const;
/** Classify a supplied oriented great-circle arc relative to a half-turn; no geodesic coordinates are computed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arcRadians, fullTurnRadians } = request;
  const compute = (): Output => {
    H.positive(fullTurnRadians);
    H.domain(arcRadians >= 0 && arcRadians <= fullTurnRadians);
    return {
      relativeSign: Math.sign(arcRadians - fullTurnRadians / 2),
      halfway: arcRadians === fullTurnRadians / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { arcRadians: 3, fullTurnRadians: 6 },
  output: { relativeSign: 0, halfway: true },
} satisfies ToolExample<Input, Output>;
export const greatCircleArcHalfwaySignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/great-circle-arc-halfway-sign",
    title: "Great Circle Arc Halfway Sign Tool",
    description:
      "Classify a supplied oriented great-circle arc relative to a half-turn; no geodesic coordinates are computed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arcRadians: { type: "number", minimum: 0 },
        fullTurnRadians: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["arcRadians", "fullTurnRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeSign: { type: "integer" },
        halfway: { type: "boolean" },
      },
      required: ["relativeSign", "halfway"],
    },
    ports: {
      inputs: [
        {
          id: "arcRadians",
          label: "Arc Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fullTurnRadians",
          label: "Full Turn Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeSign",
          label: "Relative Sign",
          valueType: { type: "integer" },
        },
        { id: "halfway", label: "Halfway", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = greatCircleArcHalfwaySignTool.execute;
export default greatCircleArcHalfwaySignTool;
