import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pressureChanges: readonly number[];
  readonly durations: readonly number[];
  readonly referenceDuration: number;
};
export type Output = {
  readonly weightedRate: number;
  readonly referenceChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressureChanges: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    durations: { type: "array", maxItems: 256, items: { type: "number" } },
    referenceDuration: { type: "number", minimum: 0 },
  },
  required: ["pressureChanges", "durations", "referenceDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedRate: { type: "number" },
    referenceChange: { type: "number" },
  },
  required: ["weightedRate", "referenceChange"],
} as const;
/** Pooled pressure-change rate over supplied nonoverlapping intervals, rebased to an explicit duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pressureChanges, durations, referenceDuration } = request;
  const compute = (): Output => {
    H.sameLength(pressureChanges, durations);
    H.domain(
      durations.length > 0 &&
        durations.every((x) => x > 0) &&
        referenceDuration >= 0,
    );
    return {
      weightedRate:
        pressureChanges.reduce((a, b) => a + b, 0) /
        durations.reduce((a, b) => a + b, 0),
      referenceChange:
        (referenceDuration * pressureChanges.reduce((a, b) => a + b, 0)) /
        durations.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pressureChanges: [2, -1], durations: [2, 3], referenceDuration: 3 },
  output: { weightedRate: 0.2, referenceChange: 0.6 },
} satisfies ToolExample<Input, Output>;
export const pressureTendencyTimeWindowWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/pressure-tendency-time-window-weight",
    title: "Pressure Tendency Time Window Weight Tool",
    description:
      "Pooled pressure-change rate over supplied nonoverlapping intervals, rebased to an explicit duration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pressureChanges: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        durations: { type: "array", maxItems: 256, items: { type: "number" } },
        referenceDuration: { type: "number", minimum: 0 },
      },
      required: ["pressureChanges", "durations", "referenceDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedRate: { type: "number" },
        referenceChange: { type: "number" },
      },
      required: ["weightedRate", "referenceChange"],
    },
    ports: {
      inputs: [
        {
          id: "pressureChanges",
          label: "Pressure Changes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceDuration",
          label: "Reference Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedRate",
          label: "Weighted Rate",
          valueType: { type: "number" },
        },
        {
          id: "referenceChange",
          label: "Reference Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pressureTendencyTimeWindowWeightTool.execute;
export default pressureTendencyTimeWindowWeightTool;
