import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledStartElapsedMinutes: number;
  readonly cancellationElapsedMinutes: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledStartElapsedMinutes: { type: "number" },
    cancellationElapsedMinutes: { type: "number" },
  },
  required: ["scheduledStartElapsedMinutes", "cancellationElapsedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied cancellation time minus scheduled session start on one monotonic time basis; negative means before start. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduledStartElapsedMinutes, cancellationElapsedMinutes } = request;
  const compute = (): Output => {
    return {
      signedGap: cancellationElapsedMinutes - scheduledStartElapsedMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scheduledStartElapsedMinutes: 12, cancellationElapsedMinutes: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const hygieneSessionLateCancellationIntervalTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "dental-hygiene/hygiene-session-late-cancellation-interval",
      title: "Hygiene Session Late Cancellation Interval Tool",
      description:
        "Calculate supplied cancellation time minus scheduled session start on one monotonic time basis; negative means before start.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scheduledStartElapsedMinutes: { type: "number" },
          cancellationElapsedMinutes: { type: "number" },
        },
        required: [
          "scheduledStartElapsedMinutes",
          "cancellationElapsedMinutes",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedGap: { type: "number" } },
        required: ["signedGap"],
      },
      ports: {
        inputs: [
          {
            id: "scheduledStartElapsedMinutes",
            label: "Scheduled Start Elapsed Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cancellationElapsedMinutes",
            label: "Cancellation Elapsed Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hygieneSessionLateCancellationIntervalTool.execute;
export default hygieneSessionLateCancellationIntervalTool;
