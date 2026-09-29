import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossVolume: number;
  readonly minimumReserve: number;
  readonly deadVolume: number;
  readonly currentVolume: number;
};
export type Output = {
  readonly workingCapacity: number;
  readonly usableCurrent: number;
  readonly marginToReserve: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossVolume: { type: "number" },
    minimumReserve: { type: "number", minimum: 0 },
    deadVolume: { type: "number", minimum: 0 },
    currentVolume: { type: "number", minimum: 0 },
  },
  required: ["grossVolume", "minimumReserve", "deadVolume", "currentVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workingCapacity: { type: "number" },
    usableCurrent: { type: "number" },
    marginToReserve: { type: "number" },
  },
  required: ["workingCapacity", "usableCurrent", "marginToReserve"],
} as const;
/** Calculate hydroponic reservoir working volume gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossVolume, minimumReserve, deadVolume, currentVolume } = request;
  const compute = (): Output => {
    H.domain(
      grossVolume >= minimumReserve + deadVolume &&
        minimumReserve >= 0 &&
        deadVolume >= 0 &&
        currentVolume >= 0,
    );
    return {
      workingCapacity: grossVolume - minimumReserve - deadVolume,
      usableCurrent: currentVolume - deadVolume,
      marginToReserve: currentVolume - minimumReserve - deadVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossVolume: 100,
    minimumReserve: 20,
    deadVolume: 5,
    currentVolume: 60,
  },
  output: { workingCapacity: 75, usableCurrent: 55, marginToReserve: 35 },
} satisfies ToolExample<Input, Output>;
export const hydroponicReservoirWorkingVolumeGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydroponics/hydroponic-reservoir-working-volume-gap",
      title: "Hydroponic Reservoir Working Volume Gap Tool",
      description:
        "Calculate hydroponic reservoir working volume gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossVolume: { type: "number" },
          minimumReserve: { type: "number", minimum: 0 },
          deadVolume: { type: "number", minimum: 0 },
          currentVolume: { type: "number", minimum: 0 },
        },
        required: [
          "grossVolume",
          "minimumReserve",
          "deadVolume",
          "currentVolume",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          workingCapacity: { type: "number" },
          usableCurrent: { type: "number" },
          marginToReserve: { type: "number" },
        },
        required: ["workingCapacity", "usableCurrent", "marginToReserve"],
      },
      ports: {
        inputs: [
          {
            id: "grossVolume",
            label: "Gross Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minimumReserve",
            label: "Minimum Reserve",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deadVolume",
            label: "Dead Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "currentVolume",
            label: "Current Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "workingCapacity",
            label: "Working Capacity",
            valueType: { type: "number" },
          },
          {
            id: "usableCurrent",
            label: "Usable Current",
            valueType: { type: "number" },
          },
          {
            id: "marginToReserve",
            label: "Margin To Reserve",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hydroponicReservoirWorkingVolumeGapTool.execute;
export default hydroponicReservoirWorkingVolumeGapTool;
