import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visits: number;
  readonly flowers: number;
  readonly observationMinutes: number;
  readonly repeatVisits: number;
  readonly excludeRepeats: boolean;
};
export type Output = {
  readonly countedVisits: number;
  readonly flowerMinutes: number;
  readonly rate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visits: { type: "integer", minimum: 0 },
    flowers: { type: "integer", minimum: 1 },
    observationMinutes: { type: "number", exclusiveMinimum: 0 },
    repeatVisits: { type: "integer", minimum: 0 },
    excludeRepeats: { type: "boolean" },
  },
  required: [
    "visits",
    "flowers",
    "observationMinutes",
    "repeatVisits",
    "excludeRepeats",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedVisits: { type: "integer" },
    flowerMinutes: { type: "number" },
    rate: { type: "number" },
  },
  required: ["countedVisits", "flowerMinutes", "rate"],
} as const;
/** Calculate beneficial insect flower visit rate from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visits, flowers, observationMinutes, repeatVisits, excludeRepeats } =
    request;
  const compute = (): Output => {
    H.integer(visits, 0);
    H.integer(repeatVisits, 0, visits);
    H.integer(flowers, 1);
    H.positive(observationMinutes);
    return {
      countedVisits: visits - (excludeRepeats ? repeatVisits : 0),
      flowerMinutes: flowers * observationMinutes,
      rate:
        (visits - (excludeRepeats ? repeatVisits : 0)) /
        (flowers * observationMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    visits: 30,
    flowers: 10,
    observationMinutes: 5,
    repeatVisits: 5,
    excludeRepeats: true,
  },
  output: { countedVisits: 25, flowerMinutes: 50, rate: 0.5 },
} satisfies ToolExample<Input, Output>;
export const beneficialInsectFlowerVisitRateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/beneficial-insect-flower-visit-rate",
    title: "Beneficial Insect Flower Visit Rate Tool",
    description:
      "Calculate beneficial insect flower visit rate from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visits: { type: "integer", minimum: 0 },
        flowers: { type: "integer", minimum: 1 },
        observationMinutes: { type: "number", exclusiveMinimum: 0 },
        repeatVisits: { type: "integer", minimum: 0 },
        excludeRepeats: { type: "boolean" },
      },
      required: [
        "visits",
        "flowers",
        "observationMinutes",
        "repeatVisits",
        "excludeRepeats",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedVisits: { type: "integer" },
        flowerMinutes: { type: "number" },
        rate: { type: "number" },
      },
      required: ["countedVisits", "flowerMinutes", "rate"],
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
          id: "observationMinutes",
          label: "Observation Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "repeatVisits",
          label: "Repeat Visits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludeRepeats",
          label: "Exclude Repeats",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "countedVisits",
          label: "Counted Visits",
          valueType: { type: "integer" },
        },
        {
          id: "flowerMinutes",
          label: "Flower Minutes",
          valueType: { type: "number", unit: "min" },
        },
        { id: "rate", label: "Rate", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = beneficialInsectFlowerVisitRateTool.execute;
export default beneficialInsectFlowerVisitRateTool;
