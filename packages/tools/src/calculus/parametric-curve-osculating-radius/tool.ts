import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly speed: number; readonly crossMagnitude: number };
export type Output = { readonly radius: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speed: { type: "number", exclusiveMinimum: 0 },
    crossMagnitude: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["speed", "crossMagnitude"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radius: { type: "number" } },
  required: ["radius"],
} as const;
/** Calculate parametric curve osculating radius from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { speed, crossMagnitude } = input;
  const compute = (): Output => {
    H.positive(speed);
    H.positive(crossMagnitude);
    return { radius: speed ** 3 / crossMagnitude };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { speed: 2, crossMagnitude: 4 },
  output: { radius: 2 },
} satisfies ToolExample<Input, Output>;
export const parametricCurveOsculatingRadiusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/parametric-curve-osculating-radius",
    title: "Parametric Curve Osculating Radius Tool",
    description:
      "Calculate parametric curve osculating radius from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speed: { type: "number", exclusiveMinimum: 0 },
        crossMagnitude: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["speed", "crossMagnitude"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { radius: { type: "number" } },
      required: ["radius"],
    },
    ports: {
      inputs: [
        {
          id: "speed",
          label: "Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "crossMagnitude",
          label: "Cross Magnitude",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "radius", label: "Radius", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = parametricCurveOsculatingRadiusTool.execute;
export default parametricCurveOsculatingRadiusTool;
