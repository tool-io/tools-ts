import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly demandPerDay: number;
  readonly leadDays: number;
  readonly safetyFraction: number;
  readonly containerUnits: number;
};
export type Output = {
  readonly requiredUnits: number;
  readonly unroundedContainers: number;
  readonly containers: number;
  readonly excessCapacity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    demandPerDay: { type: "number", minimum: 0 },
    leadDays: { type: "number", minimum: 0 },
    safetyFraction: { type: "number", minimum: 0 },
    containerUnits: { type: "integer", minimum: 1 },
  },
  required: ["demandPerDay", "leadDays", "safetyFraction", "containerUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredUnits: { type: "number" },
    unroundedContainers: { type: "number" },
    containers: { type: "integer" },
    excessCapacity: { type: "number" },
  },
  required: [
    "requiredUnits",
    "unroundedContainers",
    "containers",
    "excessCapacity",
  ],
} as const;
/** Deterministic demand-times-lead-time kanban count with explicit safety uplift and whole-container ceiling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { demandPerDay, leadDays, safetyFraction, containerUnits } = request;
  const compute = (): Output => {
    H.domain(demandPerDay >= 0 && leadDays >= 0 && safetyFraction >= 0);
    H.integer(containerUnits, 1);
    return {
      requiredUnits: demandPerDay * leadDays * (1 + safetyFraction),
      unroundedContainers:
        (demandPerDay * leadDays * (1 + safetyFraction)) / containerUnits,
      containers: Math.ceil(
        (demandPerDay * leadDays * (1 + safetyFraction)) / containerUnits,
      ),
      excessCapacity:
        Math.ceil(
          (demandPerDay * leadDays * (1 + safetyFraction)) / containerUnits,
        ) *
          containerUnits -
        demandPerDay * leadDays * (1 + safetyFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    demandPerDay: 100,
    leadDays: 2,
    safetyFraction: 0.1,
    containerUnits: 30,
  },
  output: {
    requiredUnits: 220.00000000000003,
    unroundedContainers: 7.333333333333334,
    containers: 8,
    excessCapacity: 19.99999999999997,
  },
} satisfies ToolExample<Input, Output>;
export const kanbanSafetyContainerRoundingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/kanban-safety-container-rounding-gap",
    title: "Kanban Safety Container Rounding Gap Tool",
    description:
      "Deterministic demand-times-lead-time kanban count with explicit safety uplift and whole-container ceiling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        demandPerDay: { type: "number", minimum: 0 },
        leadDays: { type: "number", minimum: 0 },
        safetyFraction: { type: "number", minimum: 0 },
        containerUnits: { type: "integer", minimum: 1 },
      },
      required: [
        "demandPerDay",
        "leadDays",
        "safetyFraction",
        "containerUnits",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredUnits: { type: "number" },
        unroundedContainers: { type: "number" },
        containers: { type: "integer" },
        excessCapacity: { type: "number" },
      },
      required: [
        "requiredUnits",
        "unroundedContainers",
        "containers",
        "excessCapacity",
      ],
    },
    ports: {
      inputs: [
        {
          id: "demandPerDay",
          label: "Demand Per Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leadDays",
          label: "Lead Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "safetyFraction",
          label: "Safety Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "containerUnits",
          label: "Container Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "requiredUnits",
          label: "Required Units",
          valueType: { type: "number" },
        },
        {
          id: "unroundedContainers",
          label: "Unrounded Containers",
          valueType: { type: "number" },
        },
        {
          id: "containers",
          label: "Containers",
          valueType: { type: "integer" },
        },
        {
          id: "excessCapacity",
          label: "Excess Capacity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = kanbanSafetyContainerRoundingGapTool.execute;
export default kanbanSafetyContainerRoundingGapTool;
