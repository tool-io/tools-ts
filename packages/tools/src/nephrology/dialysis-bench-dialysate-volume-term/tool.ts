import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowPerMinute: number;
  readonly activeMinutes: number;
  readonly primeVolume: number;
  readonly recoveredVolume: number;
};
export type Output = {
  readonly flowVolume: number;
  readonly totalInputVolume: number;
  readonly unrecoveredVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowPerMinute: { type: "number", minimum: 0 },
    activeMinutes: { type: "number", minimum: 0 },
    primeVolume: { type: "number", minimum: 0 },
    recoveredVolume: { type: "number", minimum: 0 },
  },
  required: [
    "flowPerMinute",
    "activeMinutes",
    "primeVolume",
    "recoveredVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowVolume: { type: "number" },
    totalInputVolume: { type: "number" },
    unrecoveredVolume: { type: "number" },
  },
  required: ["flowVolume", "totalInputVolume", "unrecoveredVolume"],
} as const;
/** Bench fluid inventory from explicit nominal flow and active time, without specifying treatment flow or fluid composition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flowPerMinute, activeMinutes, primeVolume, recoveredVolume } =
    request;
  const compute = (): Output => {
    H.domain(
      flowPerMinute >= 0 &&
        activeMinutes >= 0 &&
        primeVolume >= 0 &&
        recoveredVolume >= 0,
    );
    return {
      flowVolume: flowPerMinute * activeMinutes,
      totalInputVolume: flowPerMinute * activeMinutes + primeVolume,
      unrecoveredVolume:
        flowPerMinute * activeMinutes + primeVolume - recoveredVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    flowPerMinute: 500,
    activeMinutes: 120,
    primeVolume: 1000,
    recoveredVolume: 60000,
  },
  output: {
    flowVolume: 60000,
    totalInputVolume: 61000,
    unrecoveredVolume: 1000,
  },
} satisfies ToolExample<Input, Output>;
export const dialysisBenchDialysateVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nephrology/dialysis-bench-dialysate-volume-term",
    title: "Dialysis Bench Dialysate Volume Term Tool",
    description:
      "Bench fluid inventory from explicit nominal flow and active time, without specifying treatment flow or fluid composition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flowPerMinute: { type: "number", minimum: 0 },
        activeMinutes: { type: "number", minimum: 0 },
        primeVolume: { type: "number", minimum: 0 },
        recoveredVolume: { type: "number", minimum: 0 },
      },
      required: [
        "flowPerMinute",
        "activeMinutes",
        "primeVolume",
        "recoveredVolume",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flowVolume: { type: "number" },
        totalInputVolume: { type: "number" },
        unrecoveredVolume: { type: "number" },
      },
      required: ["flowVolume", "totalInputVolume", "unrecoveredVolume"],
    },
    ports: {
      inputs: [
        {
          id: "flowPerMinute",
          label: "Flow Per Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "activeMinutes",
          label: "Active Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "primeVolume",
          label: "Prime Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recoveredVolume",
          label: "Recovered Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "flowVolume",
          label: "Flow Volume",
          valueType: { type: "number" },
        },
        {
          id: "totalInputVolume",
          label: "Total Input Volume",
          valueType: { type: "number" },
        },
        {
          id: "unrecoveredVolume",
          label: "Unrecovered Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dialysisBenchDialysateVolumeTermTool.execute;
export default dialysisBenchDialysateVolumeTermTool;
