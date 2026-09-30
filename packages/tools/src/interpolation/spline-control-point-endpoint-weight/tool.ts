import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly degree: number;
  readonly atEnd: boolean;
  readonly controlIndex: number;
};
export type Output = { readonly weight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degree: { type: "integer", minimum: 0, maximum: 255 },
    atEnd: { type: "boolean" },
    controlIndex: { type: "integer", minimum: 0 },
  },
  required: ["degree", "atEnd", "controlIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weight: { type: "integer" } },
  required: ["weight"],
} as const;
/** Endpoint control-point weight for a clamped single-span Bernstein/Bezier polynomial. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { degree, atEnd, controlIndex } = request;
  const compute = (): Output => {
    H.integer(degree, 0, 255);
    H.integer(controlIndex, 0, degree);
    return { weight: controlIndex === (atEnd ? degree : 0) ? 1 : 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { degree: 3, atEnd: true, controlIndex: 3 },
  output: { weight: 1 },
} satisfies ToolExample<Input, Output>;
export const splineControlPointEndpointWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/spline-control-point-endpoint-weight",
    title: "Spline Control Point Endpoint Weight Tool",
    description:
      "Endpoint control-point weight for a clamped single-span Bernstein/Bezier polynomial.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        degree: { type: "integer", minimum: 0, maximum: 255 },
        atEnd: { type: "boolean" },
        controlIndex: { type: "integer", minimum: 0 },
      },
      required: ["degree", "atEnd", "controlIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weight: { type: "integer" } },
      required: ["weight"],
    },
    ports: {
      inputs: [
        {
          id: "degree",
          label: "Degree",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "atEnd",
          label: "At End",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "controlIndex",
          label: "Control Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "weight", label: "Weight", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = splineControlPointEndpointWeightTool.execute;
export default splineControlPointEndpointWeightTool;
