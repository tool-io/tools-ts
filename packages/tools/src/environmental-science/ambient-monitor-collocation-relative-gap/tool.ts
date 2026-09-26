import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = {
  readonly signedDifference: number;
  readonly relativeDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { first: { type: "number" }, second: { type: "number" } },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDifference: { type: "number" },
    relativeDifference: { type: "number" },
  },
  required: ["signedDifference", "relativeDifference"],
} as const;
/** Calculate ambient monitor collocation relative gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.positive(Math.abs(first) + Math.abs(second));
    return {
      signedDifference: first - second,
      relativeDifference:
        (2 * (first - second)) / (Math.abs(first) + Math.abs(second)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 12, second: 8 },
  output: { signedDifference: 4, relativeDifference: 0.4 },
} satisfies ToolExample<Input, Output>;
export const ambientMonitorCollocationRelativeGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-science/ambient-monitor-collocation-relative-gap",
      title: "Ambient Monitor Collocation Relative Gap Tool",
      description:
        "Calculate ambient monitor collocation relative gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { first: { type: "number" }, second: { type: "number" } },
        required: ["first", "second"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedDifference: { type: "number" },
          relativeDifference: { type: "number" },
        },
        required: ["signedDifference", "relativeDifference"],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedDifference",
            label: "Signed Difference",
            valueType: { type: "number" },
          },
          {
            id: "relativeDifference",
            label: "Relative Difference",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ambientMonitorCollocationRelativeGapTool.execute;
export default ambientMonitorCollocationRelativeGapTool;
