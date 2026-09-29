import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly semimajor: number; readonly semiminor: number };
export type Output = { readonly circumference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    semimajor: { type: "number" },
    semiminor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["semimajor", "semiminor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { circumference: { type: "number" } },
  required: ["circumference"],
} as const;
/** Estimate an elliptical grip circumference with Ramanujan’s first approximation, not an exact elliptic integral. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { semimajor, semiminor } = request;
  const compute = (): Output => {
    H.domain(semimajor >= semiminor && semiminor > 0);
    return {
      circumference:
        Math.PI *
        (3 * (semimajor + semiminor) -
          Math.sqrt((3 * semimajor + semiminor) * (semimajor + 3 * semiminor))),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { semimajor: 2, semiminor: 1 },
  output: { circumference: 9.688421097671288 },
} satisfies ToolExample<Input, Output>;
export const gripOvalCircumferenceEstimateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/grip-oval-circumference-estimate",
    title: "Grip Oval Circumference Estimate Tool",
    description:
      "Estimate an elliptical grip circumference with Ramanujan’s first approximation, not an exact elliptic integral.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        semimajor: { type: "number" },
        semiminor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["semimajor", "semiminor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { circumference: { type: "number" } },
      required: ["circumference"],
    },
    ports: {
      inputs: [
        {
          id: "semimajor",
          label: "Semimajor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "semiminor",
          label: "Semiminor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "circumference",
          label: "Circumference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gripOvalCircumferenceEstimateTool.execute;
export default gripOvalCircumferenceEstimateTool;
