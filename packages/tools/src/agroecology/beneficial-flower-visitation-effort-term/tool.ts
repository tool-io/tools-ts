import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visits: number;
  readonly flowers: number;
  readonly minutes: number;
  readonly observers: number;
};
export type Output = {
  readonly visitsPerFlowerMinute: number;
  readonly visitsPerObserverMinute: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visits: { type: "integer", minimum: 0 },
    flowers: { type: "integer", minimum: 1 },
    minutes: { type: "number", exclusiveMinimum: 0 },
    observers: { type: "integer", minimum: 1 },
  },
  required: ["visits", "flowers", "minutes", "observers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitsPerFlowerMinute: { type: "number" },
    visitsPerObserverMinute: { type: "number" },
  },
  required: ["visitsPerFlowerMinute", "visitsPerObserverMinute"],
} as const;
/** Calculate beneficial flower visitation effort term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visits, flowers, minutes, observers } = request;
  const compute = (): Output => {
    H.integer(visits, 0);
    H.integer(flowers, 1);
    H.positive(minutes);
    H.integer(observers, 1);
    return {
      visitsPerFlowerMinute: visits / (flowers * minutes),
      visitsPerObserverMinute: visits / (observers * minutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visits: 60, flowers: 10, minutes: 3, observers: 2 },
  output: { visitsPerFlowerMinute: 2, visitsPerObserverMinute: 10 },
} satisfies ToolExample<Input, Output>;
export const beneficialFlowerVisitationEffortTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agroecology/beneficial-flower-visitation-effort-term",
      title: "Beneficial Flower Visitation Effort Term Tool",
      description:
        "Calculate beneficial flower visitation effort term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          visits: { type: "integer", minimum: 0 },
          flowers: { type: "integer", minimum: 1 },
          minutes: { type: "number", exclusiveMinimum: 0 },
          observers: { type: "integer", minimum: 1 },
        },
        required: ["visits", "flowers", "minutes", "observers"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          visitsPerFlowerMinute: { type: "number" },
          visitsPerObserverMinute: { type: "number" },
        },
        required: ["visitsPerFlowerMinute", "visitsPerObserverMinute"],
      },
      ports: {
        inputs: [
          {
            id: "visits",
            label: "Visits",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "flowers",
            label: "Flowers",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "minutes",
            label: "Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observers",
            label: "Observers",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "visitsPerFlowerMinute",
            label: "Visits Per Flower Minute",
            valueType: { type: "number" },
          },
          {
            id: "visitsPerObserverMinute",
            label: "Visits Per Observer Minute",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = beneficialFlowerVisitationEffortTermTool.execute;
export default beneficialFlowerVisitationEffortTermTool;
