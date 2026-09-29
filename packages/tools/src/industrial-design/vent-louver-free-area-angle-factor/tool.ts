import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossArea: number;
  readonly openFraction: number;
  readonly angleRadians: number;
};
export type Output = { readonly projectedFreeArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossArea: { type: "number", minimum: 0 },
    openFraction: { type: "number", minimum: 0, maximum: 1 },
    angleRadians: { type: "number" },
  },
  required: ["grossArea", "openFraction", "angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { projectedFreeArea: { type: "number" } },
  required: ["projectedFreeArea"],
} as const;
/** Calculate vent louver free area angle factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossArea, openFraction, angleRadians } = request;
  const compute = (): Output => {
    H.domain(grossArea >= 0);
    H.probability(openFraction);
    return {
      projectedFreeArea:
        grossArea * openFraction * Math.abs(Math.cos(angleRadians)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossArea: 100,
    openFraction: 0.6,
    angleRadians: 1.0471975511965976,
  },
  output: { projectedFreeArea: 30.000000000000007 },
} satisfies ToolExample<Input, Output>;
export const ventLouverFreeAreaAngleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/vent-louver-free-area-angle-factor",
    title: "Vent Louver Free Area Angle Factor Tool",
    description:
      "Calculate vent louver free area angle factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossArea: { type: "number", minimum: 0 },
        openFraction: { type: "number", minimum: 0, maximum: 1 },
        angleRadians: { type: "number" },
      },
      required: ["grossArea", "openFraction", "angleRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { projectedFreeArea: { type: "number" } },
      required: ["projectedFreeArea"],
    },
    ports: {
      inputs: [
        {
          id: "grossArea",
          label: "Gross Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openFraction",
          label: "Open Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "projectedFreeArea",
          label: "Projected Free Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ventLouverFreeAreaAngleFactorTool.execute;
export default ventLouverFreeAreaAngleFactorTool;
