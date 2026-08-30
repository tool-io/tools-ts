import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cuttingSpeedMmPerSecond: number;
  readonly commandLatencyMilliseconds: number;
  readonly plannedOvercutMillimeters: number;
}>;
export type Output = Readonly<{
  readonly latencyTravelMillimeters: number;
  readonly totalLeadDistanceMillimeters: number;
}>;

export const calculate = (input: Input): Output => {
  const latencyTravelMillimeters =
    (input.cuttingSpeedMmPerSecond * input.commandLatencyMilliseconds) / 1000;
  return {
    latencyTravelMillimeters,
    totalLeadDistanceMillimeters:
      latencyTravelMillimeters + input.plannedOvercutMillimeters,
  };
};

export const exampleInput = {
  cuttingSpeedMmPerSecond: 100,
  commandLatencyMilliseconds: 20,
  plannedOvercutMillimeters: 1,
} satisfies Input;
export const exampleOutput = {
  latencyTravelMillimeters: 2,
  totalLeadDistanceMillimeters: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      cuttingSpeedMmPerSecond: input.cuttingSpeedMmPerSecond as number,
      commandLatencyMilliseconds: input.commandLatencyMilliseconds as number,
      plannedOvercutMillimeters: input.plannedOvercutMillimeters as number,
    }),
  description:
    "Calculate cutting lead distance from motion latency and planned overcut.",
  id: "laser/cutting-lead-distance",
  inputs: [
    {
      id: "cuttingSpeedMmPerSecond",
      label: "Cutting speed",
      kind: "number",
      minimum: 0,
      unit: "mm/s",
    },
    {
      id: "commandLatencyMilliseconds",
      label: "Command latency",
      kind: "number",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "plannedOvercutMillimeters",
      label: "Planned overcut",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "latencyTravelMillimeters",
      label: "Travel during latency",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "totalLeadDistanceMillimeters",
      label: "Total lead distance",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
  ],
  title: "Cutting Lead Distance",
});

export const run = tool.execute;
export default tool;
