import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { busyDuration: 75, totalDuration: 100 },
  output: { utilizationPercent: 75 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/bus-utilization",
  title: "Bus Utilization",
  description:
    "Calculate percent of an observation interval during which a bus was busy. Busy and total duration must use the same unit; utilization does not by itself reveal useful payload throughput.",
  inputs: [
    { id: "busyDuration", kind: "number", label: "Busy duration", minimum: 0 },
    {
      id: "totalDuration",
      kind: "number",
      label: "Total duration",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "utilizationPercent", kind: "number", label: "Utilization Percent" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.busyDuration > i.totalDuration)
      simpleError(
        "busyDuration",
        "Busy duration cannot exceed total duration.",
      );
    const output = {
      utilizationPercent: (i.busyDuration / i.totalDuration) * 100,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type BusUtilizationInput = Readonly<typeof example.input>;
export type BusUtilizationOutput = Readonly<typeof example.output>;
export const busUtilizationTool = tool;
export const runBusUtilization = tool.execute;
export default tool;
