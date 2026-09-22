import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentVolume: number;
  readonly drainbackVolume: number;
  readonly suppliedReserve: number;
  readonly capacity: number;
};
export type Output = {
  readonly afterDrainback: number;
  readonly reserveMargin: number;
  readonly capacityMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentVolume: { type: "number", minimum: 0 },
    drainbackVolume: { type: "number", minimum: 0 },
    suppliedReserve: { type: "number", minimum: 0 },
    capacity: { type: "number", minimum: 0 },
  },
  required: ["currentVolume", "drainbackVolume", "suppliedReserve", "capacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    afterDrainback: { type: "number" },
    reserveMargin: { type: "number" },
    capacityMargin: { type: "number" },
  },
  required: ["afterDrainback", "reserveMargin", "capacityMargin"],
} as const;
/** Calculate aquaponic sump minimum volume caller gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentVolume, drainbackVolume, suppliedReserve, capacity } = request;
  const compute = (): Output => {
    H.domain(
      currentVolume >= 0 &&
        drainbackVolume >= 0 &&
        suppliedReserve >= 0 &&
        capacity >= 0,
    );
    return {
      afterDrainback: currentVolume + drainbackVolume,
      reserveMargin: currentVolume - suppliedReserve,
      capacityMargin: capacity - currentVolume - drainbackVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    currentVolume: 40,
    drainbackVolume: 20,
    suppliedReserve: 15,
    capacity: 80,
  },
  output: { afterDrainback: 60, reserveMargin: 25, capacityMargin: 20 },
} satisfies ToolExample<Input, Output>;
export const aquaponicSumpMinimumVolumeCallerGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquaponics/aquaponic-sump-minimum-volume-caller-gap",
      title: "Aquaponic Sump Minimum Volume Caller Gap Tool",
      description:
        "Calculate aquaponic sump minimum volume caller gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          currentVolume: { type: "number", minimum: 0 },
          drainbackVolume: { type: "number", minimum: 0 },
          suppliedReserve: { type: "number", minimum: 0 },
          capacity: { type: "number", minimum: 0 },
        },
        required: [
          "currentVolume",
          "drainbackVolume",
          "suppliedReserve",
          "capacity",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          afterDrainback: { type: "number" },
          reserveMargin: { type: "number" },
          capacityMargin: { type: "number" },
        },
        required: ["afterDrainback", "reserveMargin", "capacityMargin"],
      },
      ports: {
        inputs: [
          {
            id: "currentVolume",
            label: "Current Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "drainbackVolume",
            label: "Drainback Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedReserve",
            label: "Supplied Reserve",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "capacity",
            label: "Capacity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "afterDrainback",
            label: "After Drainback",
            valueType: { type: "number" },
          },
          {
            id: "reserveMargin",
            label: "Reserve Margin",
            valueType: { type: "number" },
          },
          {
            id: "capacityMargin",
            label: "Capacity Margin",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = aquaponicSumpMinimumVolumeCallerGapTool.execute;
export default aquaponicSumpMinimumVolumeCallerGapTool;
