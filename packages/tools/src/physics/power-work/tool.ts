import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const powerWorkTool = createSimpleTool({
  id: "physics/power-work",
  title: "Power From Work Calculator",
  description:
    "Compute average power as work done divided by elapsed time (P = W/t).",
  inputs: [
    {
      description: "Work in joules.",
      id: "workJoules",
      label: "Work",
      kind: "number",
      unit: "J",
    },
    {
      description: "Elapsed time in seconds; must be greater than zero.",
      id: "seconds",
      label: "Time",
      kind: "number",
      unit: "s",
    },
  ],
  outputs: [{ id: "watts", label: "Power", kind: "number", unit: "W" }],
  calculate: (input) => {
    const seconds = input.seconds as number;
    if (seconds <= 0)
      simpleError(
        "seconds",
        "The elapsed time must be greater than zero seconds.",
        "invalid_time",
      );
    return { watts: (input.workJoules as number) / seconds };
  },
});
export const runPowerFromWork = powerWorkTool.execute;
export default powerWorkTool;

export type PowerWorkInput = {
  readonly workJoules: number;
  readonly seconds: number;
};

export type PowerWorkOutput = {
  readonly watts: number;
};

export const powerWorkExample = {
  input: {
    workJoules: 1,
    seconds: 1,
  },
  output: {
    watts: 1,
  },
} satisfies ToolExample<PowerWorkInput, PowerWorkOutput>;
