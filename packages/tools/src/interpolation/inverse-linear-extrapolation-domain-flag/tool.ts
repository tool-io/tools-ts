import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x0: number;
  readonly x1: number;
  readonly y0: number;
  readonly y1: number;
  readonly targetY: number;
};
export type Output = {
  readonly inverseX: number;
  readonly extrapolated: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x0: { type: "number" },
    x1: { type: "number" },
    y0: { type: "number" },
    y1: { type: "number" },
    targetY: { type: "number" },
  },
  required: ["x0", "x1", "y0", "y1", "targetY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inverseX: { type: "number" },
    extrapolated: { type: "boolean" },
  },
  required: ["inverseX", "extrapolated"],
} as const;
/** Calculate inverse linear extrapolation domain flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x0, x1, y0, y1, targetY } = request;
  const compute = (): Output => {
    H.domain(x0 !== x1 && y0 !== y1);
    return {
      inverseX: x0 + ((targetY - y0) * (x1 - x0)) / (y1 - y0),
      extrapolated: targetY < Math.min(y0, y1) || targetY > Math.max(y0, y1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x0: 0, x1: 10, y0: 0, y1: 20, targetY: 30 },
  output: { inverseX: 15, extrapolated: true },
} satisfies ToolExample<Input, Output>;
export const inverseLinearExtrapolationDomainFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "interpolation/inverse-linear-extrapolation-domain-flag",
      title: "Inverse Linear Extrapolation Domain Flag Tool",
      description:
        "Calculate inverse linear extrapolation domain flag from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          x0: { type: "number" },
          x1: { type: "number" },
          y0: { type: "number" },
          y1: { type: "number" },
          targetY: { type: "number" },
        },
        required: ["x0", "x1", "y0", "y1", "targetY"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inverseX: { type: "number" },
          extrapolated: { type: "boolean" },
        },
        required: ["inverseX", "extrapolated"],
      },
      ports: {
        inputs: [
          {
            id: "x0",
            label: "X0",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "x1",
            label: "X1",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "y0",
            label: "Y0",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "y1",
            label: "Y1",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetY",
            label: "Target Y",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "inverseX", label: "Inverse X", valueType: { type: "number" } },
          {
            id: "extrapolated",
            label: "Extrapolated",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = inverseLinearExtrapolationDomainFlagTool.execute;
export default inverseLinearExtrapolationDomainFlagTool;
