import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseHeight: number;
  readonly distance: number;
  readonly setback: number;
  readonly risePerRun: number;
};
export type Output = { readonly allowedHeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseHeight: { type: "number", minimum: 0 },
    distance: { type: "number", minimum: 0 },
    setback: { type: "number", minimum: 0 },
    risePerRun: { type: "number", minimum: 0 },
  },
  required: ["baseHeight", "distance", "setback", "risePerRun"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { allowedHeight: { type: "number" } },
  required: ["allowedHeight"],
} as const;
/** Explicit piecewise plane starts rising beyond the supplied setback; no zoning rule is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseHeight, distance, setback, risePerRun } = request;
  const compute = (): Output => {
    H.domain(
      baseHeight >= 0 && distance >= 0 && setback >= 0 && risePerRun >= 0,
    );
    return {
      allowedHeight: baseHeight + Math.max(0, distance - setback) * risePerRun,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseHeight: 10, distance: 8, setback: 3, risePerRun: 2 },
  output: { allowedHeight: 20 },
} satisfies ToolExample<Input, Output>;
export const setbackPlaneHeightAtDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/setback-plane-height-at-distance",
    title: "Setback Plane Height At Distance Tool",
    description:
      "Explicit piecewise plane starts rising beyond the supplied setback; no zoning rule is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseHeight: { type: "number", minimum: 0 },
        distance: { type: "number", minimum: 0 },
        setback: { type: "number", minimum: 0 },
        risePerRun: { type: "number", minimum: 0 },
      },
      required: ["baseHeight", "distance", "setback", "risePerRun"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { allowedHeight: { type: "number" } },
      required: ["allowedHeight"],
    },
    ports: {
      inputs: [
        {
          id: "baseHeight",
          label: "Base Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "setback",
          label: "Setback",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "risePerRun",
          label: "Rise Per Run",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "allowedHeight",
          label: "Allowed Height",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = setbackPlaneHeightAtDistanceTool.execute;
export default setbackPlaneHeightAtDistanceTool;
