import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly semiMajor: number;
  readonly semiMinor: number;
  readonly vary: string;
};
export type Output = {
  readonly focalDistance: number;
  readonly derivativeDefined: boolean;
  readonly derivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    semiMajor: { type: "number" },
    semiMinor: { type: "number", exclusiveMinimum: 0 },
    vary: { type: "string", maxLength: 8192 },
  },
  required: ["semiMajor", "semiMinor", "vary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    focalDistance: { type: "number" },
    derivativeDefined: { type: "boolean" },
    derivative: { type: "number" },
  },
  required: ["focalDistance", "derivativeDefined", "derivative"],
} as const;
/** Derivative of center-to-focus distance with the other semiaxis fixed; circular singularity is flagged. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { semiMajor, semiMinor, vary } = request;
  const compute = (): Output => {
    H.domain(
      semiMajor >= semiMinor &&
        semiMinor > 0 &&
        ["major", "minor"].includes(vary),
    );
    return {
      focalDistance: Math.sqrt(
        (semiMajor - semiMinor) * (semiMajor + semiMinor),
      ),
      derivativeDefined: semiMajor > semiMinor,
      derivative:
        semiMajor === semiMinor
          ? 0
          : (vary === "major" ? semiMajor : -semiMinor) /
            Math.sqrt((semiMajor - semiMinor) * (semiMajor + semiMinor)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { semiMajor: 5, semiMinor: 3, vary: "major" },
  output: { focalDistance: 4, derivativeDefined: true, derivative: 1.25 },
} satisfies ToolExample<Input, Output>;
export const ellipseFocalRadiusDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/ellipse-focal-radius-derivative",
    title: "Ellipse Focal Radius Derivative Tool",
    description:
      "Derivative of center-to-focus distance with the other semiaxis fixed; circular singularity is flagged.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        semiMajor: { type: "number" },
        semiMinor: { type: "number", exclusiveMinimum: 0 },
        vary: { type: "string", maxLength: 8192 },
      },
      required: ["semiMajor", "semiMinor", "vary"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        focalDistance: { type: "number" },
        derivativeDefined: { type: "boolean" },
        derivative: { type: "number" },
      },
      required: ["focalDistance", "derivativeDefined", "derivative"],
    },
    ports: {
      inputs: [
        {
          id: "semiMajor",
          label: "Semi Major",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "semiMinor",
          label: "Semi Minor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "vary",
          label: "Vary",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "focalDistance",
          label: "Focal Distance",
          valueType: { type: "number" },
        },
        {
          id: "derivativeDefined",
          label: "Derivative Defined",
          valueType: { type: "boolean" },
        },
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ellipseFocalRadiusDerivativeTool.execute;
export default ellipseFocalRadiusDerivativeTool;
