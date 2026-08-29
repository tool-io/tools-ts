import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PcbTracePropagationDelayInput = Readonly<{
  readonly traceLengthMeters: number;
  readonly effectivePermittivity: number;
}>;
export type PcbTracePropagationDelayOutput = Readonly<{
  propagationDelaySeconds: number;
}>;

export const calculatePcbTracePropagationDelay = (
  i: PcbTracePropagationDelayInput,
): PcbTracePropagationDelayOutput => {
  if (i.effectivePermittivity < 1)
    simpleError(
      "effectivePermittivity",
      "Effective permittivity must be at least one.",
    );
  const direct =
    (i.traceLengthMeters * Math.sqrt(i.effectivePermittivity)) / 299792458;
  const value = Number.isFinite(direct)
    ? direct
    : (i.traceLengthMeters / 299792458) * Math.sqrt(i.effectivePermittivity);
  if (!Number.isFinite(value))
    simpleError(
      "propagationDelaySeconds",
      "The inputs produce a non-finite result.",
    );
  return { propagationDelaySeconds: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { traceLengthMeters: 0.3, effectivePermittivity: 3.2 },
  output: { propagationDelaySeconds: 1.7900927801190697e-9 },
} satisfies ToolExample<
  PcbTracePropagationDelayInput,
  PcbTracePropagationDelayOutput
>;

export const tool = createSimpleTool({
  id: "electronics/pcb-trace-propagation-delay",
  title: "PCB Trace Propagation Delay",
  description:
    "Estimate PCB trace flight time as length times √εeffective divided by the speed of light; use the trace geometry's effective dielectric constant.",
  inputs: [
    {
      id: "traceLengthMeters",
      kind: "number",
      label: "Trace Length (m)",
      unit: "m",
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
      id: "propagationDelaySeconds",
      kind: "number",
      label: "Propagation Delay (s)",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculatePcbTracePropagationDelay({
      traceLengthMeters: input.traceLengthMeters as number,
      effectivePermittivity: input.effectivePermittivity as number,
    }),
});
export const pcbTracePropagationDelayTool = tool;
export const runPcbTracePropagationDelay = tool.execute;
export default tool;
