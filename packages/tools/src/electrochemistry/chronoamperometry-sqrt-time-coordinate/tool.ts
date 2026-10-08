import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly elapsedSeconds: number };
export type Output = {
  readonly squareRootSeconds: number;
  readonly inverseSquareRootSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsedSeconds: { type: "number", exclusiveMinimum: 0 } },
  required: ["elapsedSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    squareRootSeconds: { type: "number" },
    inverseSquareRootSeconds: { type: "number" },
  },
  required: ["squareRootSeconds", "inverseSquareRootSeconds"],
} as const;
/** Return square-root time and reciprocal square-root time for an explicit positive chronoamperometry elapsed time without fitting a Cottrell model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedSeconds } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(elapsedSeconds) && elapsedSeconds > 0,
      "elapsedSeconds",
    ),
      elapsedSeconds);
    return {
      squareRootSeconds: Math.sqrt(elapsedSeconds),
      inverseSquareRootSeconds: 1 / Math.sqrt(elapsedSeconds),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsedSeconds: 4 },
  output: { squareRootSeconds: 2, inverseSquareRootSeconds: 0.5 },
} satisfies ToolExample<Input, Output>;
export const chronoamperometrySqrtTimeCoordinateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electrochemistry/chronoamperometry-sqrt-time-coordinate",
      title: "Chronoamperometry Sqrt Time Coordinate Tool",
      description:
        "Return square-root time and reciprocal square-root time for an explicit positive chronoamperometry elapsed time without fitting a Cottrell model.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { elapsedSeconds: { type: "number", exclusiveMinimum: 0 } },
        required: ["elapsedSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          squareRootSeconds: { type: "number" },
          inverseSquareRootSeconds: { type: "number" },
        },
        required: ["squareRootSeconds", "inverseSquareRootSeconds"],
      },
      ports: {
        inputs: [
          {
            id: "elapsedSeconds",
            label: "Elapsed Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "squareRootSeconds",
            label: "Square Root Seconds",
            valueType: { type: "number" },
          },
          {
            id: "inverseSquareRootSeconds",
            label: "Inverse Square Root Seconds",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = chronoamperometrySqrtTimeCoordinateTool.execute;
export default chronoamperometrySqrtTimeCoordinateTool;
