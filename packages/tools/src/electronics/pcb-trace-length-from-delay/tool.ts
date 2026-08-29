import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PcbTraceLengthFromDelayInput = Readonly<{
  readonly propagationDelaySeconds: number;
  readonly effectivePermittivity: number;
}>;
export type PcbTraceLengthFromDelayOutput = Readonly<{
  traceLengthMeters: number;
}>;

export const calculatePcbTraceLengthFromDelay = (
  i: PcbTraceLengthFromDelayInput,
): PcbTraceLengthFromDelayOutput => {
  if (i.effectivePermittivity < 1)
    simpleError(
      "effectivePermittivity",
      "Effective permittivity must be at least one.",
    );
  const direct =
    (i.propagationDelaySeconds * 299792458) /
    Math.sqrt(i.effectivePermittivity);
  const value = Number.isFinite(direct)
    ? direct
    : (i.propagationDelaySeconds / Math.sqrt(i.effectivePermittivity)) *
      299792458;
  if (!Number.isFinite(value))
    simpleError("traceLengthMeters", "The inputs produce a non-finite result.");
  return { traceLengthMeters: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { propagationDelaySeconds: 1e-9, effectivePermittivity: 4 },
  output: { traceLengthMeters: 0.14989622900000002 },
} satisfies ToolExample<
  PcbTraceLengthFromDelayInput,
  PcbTraceLengthFromDelayOutput
>;

export const tool = createSimpleTool({
  id: "electronics/pcb-trace-length-from-delay",
  title: "PCB Trace Length From Delay",
  description:
    "Calculate PCB trace length from measured or budgeted flight time and effective dielectric constant using speed c/√εeffective.",
  inputs: [
    {
      id: "propagationDelaySeconds",
      kind: "number",
      label: "Propagation Delay (s)",
      unit: "s",
      minimum: 0,
    },
    {
      id: "effectivePermittivity",
      kind: "number",
      label: "Effective Permittivity",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "traceLengthMeters",
      kind: "number",
      label: "Trace Length (m)",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculatePcbTraceLengthFromDelay({
      propagationDelaySeconds: input.propagationDelaySeconds as number,
      effectivePermittivity: input.effectivePermittivity as number,
    }),
});
export const pcbTraceLengthFromDelayTool = tool;
export const runPcbTraceLengthFromDelay = tool.execute;
export default tool;
