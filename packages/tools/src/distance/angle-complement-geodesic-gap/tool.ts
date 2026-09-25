import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angleRadians: number;
  readonly periodRadians: number;
};
export type Output = { readonly shorter: number; readonly complement: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angleRadians: { type: "number", minimum: 0 },
    periodRadians: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["angleRadians", "periodRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shorter: { type: "number" }, complement: { type: "number" } },
  required: ["shorter", "complement"],
} as const;
/** Return shorter and complementary arc coordinates under an explicit full-period angle convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angleRadians, periodRadians } = request;
  const compute = (): Output => {
    H.positive(periodRadians);
    H.domain(angleRadians >= 0 && angleRadians <= periodRadians);
    return {
      shorter: Math.min(angleRadians, periodRadians - angleRadians),
      complement: periodRadians - angleRadians,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angleRadians: 1, periodRadians: 6 },
  output: { shorter: 1, complement: 5 },
} satisfies ToolExample<Input, Output>;
export const angleComplementGeodesicGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/angle-complement-geodesic-gap",
    title: "Angle Complement Geodesic Gap Tool",
    description:
      "Return shorter and complementary arc coordinates under an explicit full-period angle convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angleRadians: { type: "number", minimum: 0 },
        periodRadians: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["angleRadians", "periodRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shorter: { type: "number" },
        complement: { type: "number" },
      },
      required: ["shorter", "complement"],
    },
    ports: {
      inputs: [
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodRadians",
          label: "Period Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "shorter", label: "Shorter", valueType: { type: "number" } },
        {
          id: "complement",
          label: "Complement",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = angleComplementGeodesicGapTool.execute;
export default angleComplementGeodesicGapTool;
