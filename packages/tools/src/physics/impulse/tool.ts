import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ImpulseInput = {
  readonly deltaTimeS: number;
  readonly forceN: number;
};

export type ImpulseOutput = {
  readonly impulseNs: number;
};

export const impulseExample = {
  input: { forceN: 8, deltaTimeS: 2.5 },
  output: { impulseNs: 20 },
} satisfies ToolExample<ImpulseInput, ImpulseOutput>;

export const impulseTool = createSimpleTool({
  id: "physics/impulse",
  title: "Impulse Calculator",
  description:
    "Compute impulse as constant force multiplied by the elapsed time interval (J = F·Δt).",
  inputs: [
    {
      description: "Magnitude of the constant force in newtons.",
      id: "forceN",
      label: "Force",
      kind: "number",
      unit: "N",
    },
    {
      description: "Elapsed time interval in seconds; must not be negative.",
      id: "deltaTimeS",
      label: "Time interval",
      kind: "number",
      unit: "s",
    },
  ],
  outputs: [{ id: "impulseNs", label: "Impulse", kind: "number", unit: "N·s" }],
  calculate: (input) => {
    const deltaTime = input.deltaTimeS as number;
    if (deltaTime < 0)
      simpleError(
        "deltaTimeS",
        "The time interval must not be negative.",
        "invalid_time",
      );
    return { impulseNs: (input.forceN as number) * deltaTime };
  },
});
export const runImpulse = impulseTool.execute;
export default impulseTool;
