import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly simulationTime: number;
  readonly physicalSecondsPerTimeUnit: number;
  readonly originPhysicalSeconds: number;
};
export type Output = { readonly physicalTimeSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    simulationTime: { type: "number" },
    physicalSecondsPerTimeUnit: { type: "number", exclusiveMinimum: 0 },
    originPhysicalSeconds: { type: "number" },
  },
  required: [
    "simulationTime",
    "physicalSecondsPerTimeUnit",
    "originPhysicalSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { physicalTimeSeconds: { type: "number" } },
  required: ["physicalTimeSeconds"],
} as const;
/** Place a simulation time on an explicit physical-seconds scale and origin without inferring a model’s characteristic time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { simulationTime, physicalSecondsPerTimeUnit, originPhysicalSeconds } =
    request;
  const compute = (): Output => {
    (H.domain(physicalSecondsPerTimeUnit > 0, "physicalSecondsPerTimeUnit"),
      physicalSecondsPerTimeUnit);
    return {
      physicalTimeSeconds:
        originPhysicalSeconds + simulationTime * physicalSecondsPerTimeUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    simulationTime: 12,
    physicalSecondsPerTimeUnit: 0.5,
    originPhysicalSeconds: 100,
  },
  output: { physicalTimeSeconds: 106 },
} satisfies ToolExample<Input, Output>;
export const simulationTimeUnitCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-physics", "computational physics", "physics"],
      keywords: ["computational physics", "physics"],
    },
    id: "computational-physics/simulation-time-unit-crosswalk",
    title: "Simulation Time Unit Crosswalk",
    description:
      "Place a simulation time on an explicit physical-seconds scale and origin without inferring a model’s characteristic time.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        simulationTime: { type: "number" },
        physicalSecondsPerTimeUnit: { type: "number", exclusiveMinimum: 0 },
        originPhysicalSeconds: { type: "number" },
      },
      required: [
        "simulationTime",
        "physicalSecondsPerTimeUnit",
        "originPhysicalSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { physicalTimeSeconds: { type: "number" } },
      required: ["physicalTimeSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "simulationTime",
          label: "Simulation Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "physicalSecondsPerTimeUnit",
          label: "Physical Seconds Per Time Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originPhysicalSeconds",
          label: "Origin Physical Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "physicalTimeSeconds",
          label: "Physical Time Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = simulationTimeUnitCrosswalkTool.execute;
export default simulationTimeUnitCrosswalkTool;
