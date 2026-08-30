import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QueueLengthInput = Readonly<{
  readonly initialVehicles: number;
  readonly arrivalVehiclesPerHour: number;
  readonly serviceVehiclesPerHour: number;
  readonly durationHours: number;
}>;
export type QueueLengthOutput = Readonly<{
  readonly queueVehicles: number;
}>;

export const calculateQueueLength = (
  x: QueueLengthInput,
): QueueLengthOutput => {
  if (!Number.isFinite(x.initialVehicles) || x.initialVehicles < 0)
    simpleError("initialVehicles", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.arrivalVehiclesPerHour) ||
    x.arrivalVehiclesPerHour < 0
  )
    simpleError(
      "arrivalVehiclesPerHour",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.serviceVehiclesPerHour) ||
    x.serviceVehiclesPerHour < 0
  )
    simpleError(
      "serviceVehiclesPerHour",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.durationHours) || x.durationHours < 0)
    simpleError("durationHours", "Provide a finite number at least 0.");
  const queueVehicles = Math.max(
    0,
    x.initialVehicles +
      (x.arrivalVehiclesPerHour - x.serviceVehiclesPerHour) * x.durationHours,
  );
  if (!Number.isFinite(queueVehicles))
    simpleError(
      "queueVehicles",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { queueVehicles: Object.is(queueVehicles, -0) ? 0 : queueVehicles };
};

export const example = {
  input: {
    initialVehicles: 10,
    arrivalVehiclesPerHour: 100,
    serviceVehiclesPerHour: 80,
    durationHours: 0.5,
  },
  output: { queueVehicles: 20 },
} satisfies ToolExample<QueueLengthInput, QueueLengthOutput>;

export const tool = createSimpleTool({
  id: "engineering/queue-length",
  title: "Queue Length",
  description:
    "Net accumulated queue from constant arrival and service rates over an interval, starting with a supplied initial queue; floor at zero.",
  inputs: [
    {
      id: "initialVehicles",
      kind: "number",
      label: "Initial Vehicles",
      unit: "veh",
      minimum: 0,
    },
    {
      id: "arrivalVehiclesPerHour",
      kind: "number",
      label: "Arrival Vehicles Per Hour",
      unit: "veh/h",
      minimum: 0,
    },
    {
      id: "serviceVehiclesPerHour",
      kind: "number",
      label: "Service Vehicles Per Hour",
      unit: "veh/h",
      minimum: 0,
    },
    {
      id: "durationHours",
      kind: "number",
      label: "Duration Hours",
      unit: "h",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "queueVehicles",
      kind: "number",
      label: "Queue Vehicles",
      unit: "veh",
    },
  ],
  calculate: (input) =>
    calculateQueueLength({
      initialVehicles: input.initialVehicles as number,
      arrivalVehiclesPerHour: input.arrivalVehiclesPerHour as number,
      serviceVehiclesPerHour: input.serviceVehiclesPerHour as number,
      durationHours: input.durationHours as number,
    }),
});
export const queueLengthTool = tool;
export const runQueueLength = tool.execute;
export default tool;
