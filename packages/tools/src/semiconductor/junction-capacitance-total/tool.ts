import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JunctionCapacitanceTotalInput = {
  readonly diffusionCapacitancePf?: number;
  readonly junctionCapacitancePf: number;
};

export type JunctionCapacitanceTotalOutput = {
  readonly totalPf: number;
};

export const junctionCapacitanceTotalExample = {
  input: { diffusionCapacitancePf: 10, junctionCapacitancePf: 100 },
  output: { totalPf: 110 },
} satisfies ToolExample<JunctionCapacitanceTotalInput, JunctionCapacitanceTotalOutput>;

export const calculateJunctionCapacitanceTotal = (
  input: JunctionCapacitanceTotalInput,
): JunctionCapacitanceTotalOutput => {
  const junction = input.junctionCapacitancePf;
  const diffusion = input.diffusionCapacitancePf ?? 0;
  if (junction < 0 || diffusion < 0)
    simpleError(
      "junctionCapacitancePf",
      "Capacitances cannot be negative.",
      "invalid_capacitance",
    );
  return { totalPf: junction + diffusion };
};

export const junctionCapacitanceTotalTool = createSimpleTool({
  calculate: (input) =>
    calculateJunctionCapacitanceTotal(
      input as unknown as JunctionCapacitanceTotalInput,
    ),
  description:
    "Sum depletion and diffusion capacitances into the total junction capacitance.",
  id: "semiconductor/junction-capacitance-total",
  inputs: [
    {
      description: "Depletion (junction) capacitance.",
      format: "capacitance-pf",
      id: "junctionCapacitancePf",
      kind: "number",
      label: "Junction capacitance",
      unit: "pF",
    },
    {
      default: 0,
      description:
        "Diffusion capacitance; zero for a reverse-biased junction.",
      format: "capacitance-pf",
      id: "diffusionCapacitancePf",
      kind: "number",
      label: "Diffusion capacitance",
      unit: "pF",
    },
  ],
  outputs: [
    {
      description: "Total small-signal capacitance.",
      format: "capacitance-pf",
      id: "totalPf",
      kind: "number",
      label: "Total capacitance",
      unit: "pF",
    },
  ],
  title: "Junction Capacitance Total Calculator",
});
export const runJunctionCapacitanceTotal = junctionCapacitanceTotalTool.execute;
export default junctionCapacitanceTotalTool;
