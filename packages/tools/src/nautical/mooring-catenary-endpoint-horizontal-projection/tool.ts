import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly catenaryParameter: number;
  readonly horizontalSpan: number;
};
export type Output = {
  readonly heightAboveLowest: number;
  readonly arcLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    catenaryParameter: { type: "number", exclusiveMinimum: 0 },
    horizontalSpan: { type: "number", minimum: 0 },
  },
  required: ["catenaryParameter", "horizontalSpan"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heightAboveLowest: { type: "number" },
    arcLength: { type: "number" },
  },
  required: ["heightAboveLowest", "arcLength"],
} as const;
/** Evaluate a catenary endpoint measured horizontally from its lowest point, using a supplied positive tension/weight parameter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { catenaryParameter, horizontalSpan } = request;
  const compute = (): Output => {
    H.positive(catenaryParameter);
    H.domain(horizontalSpan >= 0);
    const u = horizontalSpan / catenaryParameter;
    return {
      heightAboveLowest: catenaryParameter * (Math.cosh(u) - 1),
      arcLength: catenaryParameter * Math.sinh(u),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { catenaryParameter: 10, horizontalSpan: 5 },
  output: {
    heightAboveLowest: 1.276259652063807,
    arcLength: 5.210953054937474,
  },
} satisfies ToolExample<Input, Output>;
export const mooringCatenaryEndpointHorizontalProjectionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "nautical/mooring-catenary-endpoint-horizontal-projection",
      title: "Mooring Catenary Endpoint Horizontal Projection Tool",
      description:
        "Evaluate a catenary endpoint measured horizontally from its lowest point, using a supplied positive tension/weight parameter.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          catenaryParameter: { type: "number", exclusiveMinimum: 0 },
          horizontalSpan: { type: "number", minimum: 0 },
        },
        required: ["catenaryParameter", "horizontalSpan"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          heightAboveLowest: { type: "number" },
          arcLength: { type: "number" },
        },
        required: ["heightAboveLowest", "arcLength"],
      },
      ports: {
        inputs: [
          {
            id: "catenaryParameter",
            label: "Catenary Parameter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "horizontalSpan",
            label: "Horizontal Span",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "heightAboveLowest",
            label: "Height Above Lowest",
            valueType: { type: "number" },
          },
          {
            id: "arcLength",
            label: "Arc Length",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = mooringCatenaryEndpointHorizontalProjectionTool.execute;
export default mooringCatenaryEndpointHorizontalProjectionTool;
