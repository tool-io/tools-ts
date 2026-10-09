import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concurrentActivityMinutes: number;
  readonly observedMinutes: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concurrentActivityMinutes: { type: "number", minimum: 0 },
    observedMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["concurrentActivityMinutes", "observedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate supplied concurrent-activity time share and nonconcurrent remainder in one positive later-life time-use observation window. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concurrentActivityMinutes, observedMinutes } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(observedMinutes) && observedMinutes > 0,
      "observedMinutes",
    ),
      observedMinutes);
    H.domain(
      concurrentActivityMinutes >= 0 &&
        concurrentActivityMinutes <= observedMinutes,
      "concurrentActivityMinutes",
    );
    return {
      fraction: concurrentActivityMinutes / observedMinutes,
      remainder: observedMinutes - concurrentActivityMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concurrentActivityMinutes: 30, observedMinutes: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const laterlifeTimeUseConcurrentActivityShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gerontology/laterlife-time-use-concurrent-activity-share",
      title: "Later Life Time Use Concurrent Activity Share Tool",
      description:
        "Calculate supplied concurrent-activity time share and nonconcurrent remainder in one positive later-life time-use observation window.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          concurrentActivityMinutes: { type: "number", minimum: 0 },
          observedMinutes: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["concurrentActivityMinutes", "observedMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fraction: { type: "number" },
          remainder: { type: "number" },
        },
        required: ["fraction", "remainder"],
      },
      ports: {
        inputs: [
          {
            id: "concurrentActivityMinutes",
            label: "Concurrent Activity Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observedMinutes",
            label: "Observed Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
          {
            id: "remainder",
            label: "Remainder",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = laterlifeTimeUseConcurrentActivityShareTool.execute;
export default laterlifeTimeUseConcurrentActivityShareTool;
