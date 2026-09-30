import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centerRadius: number;
  readonly offset: number;
  readonly outward: boolean;
};
export type Output = { readonly offsetRadius: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerRadius: { type: "number" },
    offset: { type: "number" },
    outward: { type: "boolean" },
  },
  required: ["centerRadius", "offset", "outward"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offsetRadius: { type: "number" } },
  required: ["offsetRadius"],
} as const;
/** Calculate path curve offset radius from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { centerRadius, offset, outward } = request;
  const compute = (): Output => {
    H.domain(
      centerRadius >= 0 && offset >= 0 && (outward || offset <= centerRadius),
    );
    return { offsetRadius: centerRadius + (outward ? offset : -offset) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { centerRadius: 10, offset: 2, outward: true },
  output: { offsetRadius: 12 },
} satisfies ToolExample<Input, Output>;
export const pathCurveOffsetRadiusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/path-curve-offset-radius",
    title: "Path Curve Offset Radius Tool",
    description:
      "Calculate path curve offset radius from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerRadius: { type: "number" },
        offset: { type: "number" },
        outward: { type: "boolean" },
      },
      required: ["centerRadius", "offset", "outward"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offsetRadius: { type: "number" } },
      required: ["offsetRadius"],
    },
    ports: {
      inputs: [
        {
          id: "centerRadius",
          label: "Center Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outward",
          label: "Outward",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "offsetRadius",
          label: "Offset Radius",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pathCurveOffsetRadiusTool.execute;
export default pathCurveOffsetRadiusTool;
