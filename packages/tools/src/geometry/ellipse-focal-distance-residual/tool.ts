import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly semimajor: number;
  readonly semiminor: number;
  readonly suppliedFocusDistance: number;
};
export type Output = {
  readonly derivedFocusDistance: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    semimajor: { type: "number" },
    semiminor: { type: "number", minimum: 0 },
    suppliedFocusDistance: { type: "number" },
  },
  required: ["semimajor", "semiminor", "suppliedFocusDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    derivedFocusDistance: { type: "number" },
    residual: { type: "number" },
  },
  required: ["derivedFocusDistance", "residual"],
} as const;
/** Calculate ellipse focal distance residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { semimajor, semiminor, suppliedFocusDistance } = request;
  const compute = (): Output => {
    H.domain(semimajor >= semiminor && semiminor >= 0);
    const ratio = semimajor > 0 ? semiminor / semimajor : 0,
      derivedFocusDistance = semimajor * Math.sqrt((1 - ratio) * (1 + ratio));
    return {
      derivedFocusDistance,
      residual: suppliedFocusDistance - derivedFocusDistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { semimajor: 5, semiminor: 3, suppliedFocusDistance: 5 },
  output: { derivedFocusDistance: 4, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const ellipseFocalDistanceResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/ellipse-focal-distance-residual",
    title: "Ellipse Focal Distance Residual Tool",
    description:
      "Calculate ellipse focal distance residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        semimajor: { type: "number" },
        semiminor: { type: "number", minimum: 0 },
        suppliedFocusDistance: { type: "number" },
      },
      required: ["semimajor", "semiminor", "suppliedFocusDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        derivedFocusDistance: { type: "number" },
        residual: { type: "number" },
      },
      required: ["derivedFocusDistance", "residual"],
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
        {
          id: "suppliedFocusDistance",
          label: "Supplied Focus Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "derivedFocusDistance",
          label: "Derived Focus Distance",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ellipseFocalDistanceResidualTool.execute;
export default ellipseFocalDistanceResidualTool;
