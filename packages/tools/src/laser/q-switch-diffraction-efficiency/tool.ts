import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly incidentPowerWatts: number;
  readonly firstOrderPowerWatts: number;
}>;
export type Output = Readonly<{
  readonly firstOrderEfficiencyPercent: number;
  readonly undiffractedPowerWatts: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.incidentPowerWatts <= 0 ||
    input.firstOrderPowerWatts > input.incidentPowerWatts
  )
    simpleError(
      "incidentPowerWatts",
      "Incident power must be positive and at least first-order power.",
      "invalid_power",
    );
  return {
    firstOrderEfficiencyPercent:
      (input.firstOrderPowerWatts / input.incidentPowerWatts) * 100,
    undiffractedPowerWatts:
      input.incidentPowerWatts - input.firstOrderPowerWatts,
  };
};

export const exampleInput = {
  incidentPowerWatts: 10,
  firstOrderPowerWatts: 8,
} satisfies Input;
export const exampleOutput = {
  firstOrderEfficiencyPercent: 80,
  undiffractedPowerWatts: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      incidentPowerWatts: input.incidentPowerWatts as number,
      firstOrderPowerWatts: input.firstOrderPowerWatts as number,
    }),
  description:
    "Calculate measured first-order acousto-optic diffraction efficiency.",
  id: "laser/q-switch-diffraction-efficiency",
  inputs: [
    {
      id: "incidentPowerWatts",
      label: "Incident optical power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "firstOrderPowerWatts",
      label: "First-order optical power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
  ],
  outputs: [
    {
      id: "firstOrderEfficiencyPercent",
      label: "First-order efficiency",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "undiffractedPowerWatts",
      label: "Other-order power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
  ],
  title: "Q-Switch Diffraction Efficiency",
});

export const run = tool.execute;
export default tool;
