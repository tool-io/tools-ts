import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const qcVsKcCheckerTool = createSimpleTool({
  id: "chemistry/qc-vs-kc-checker",
  title: "Qc vs Kc Checker",
  description:
    "Compare the concentration-based quotient Qc against Kc to determine whether products or reactants are favored going forward.",
  inputs: [
    {
      description: "Reaction quotient Qc from current concentrations.",
      id: "qc",
      label: "Qc",
      kind: "number",
      minimum: 0,
    },
    {
      description: "Equilibrium constant Kc.",
      id: "kc",
      label: "Kc",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Direction of net reaction relative to equilibrium.",
      id: "direction",
      label: "Direction",
      kind: "string",
    },
  ],
  calculate: (input) => {
    const qc = input.qc as number;
    const kc = input.kc as number;
    if (!(kc > 0))
      simpleError("kc", "Equilibrium constant must be greater than zero.");
    const direction =
      qc > kc
        ? "reverse (toward reactants)"
        : qc === kc
          ? "at equilibrium"
          : "forward (toward products)";
    return { direction };
  },
});
export const runQcVsKcChecker = qcVsKcCheckerTool.execute;
export default qcVsKcCheckerTool;

export type QcVsKcCheckerInput = {
  readonly qc: number;
  readonly kc: number;
};

export type QcVsKcCheckerOutput = {
  readonly direction: string;
};

export const qcVsKcCheckerExample = {
  input: {
    qc: 1,
    kc: 1,
  },
  output: {
    direction: "at equilibrium",
  },
} satisfies ToolExample<QcVsKcCheckerInput, QcVsKcCheckerOutput>;
