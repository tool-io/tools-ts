import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChipletDieToDieLatencyInput = {
  readonly distanceMm: number;
  readonly interfaceOverheadNs?: number;
  readonly propagationDelayPsPerMm?: number;
};

export type ChipletDieToDieLatencyOutput = {
  readonly totalLatencyNs: number;
};

export const chipletDieToDieLatencyExample = {
  input: { distanceMm: 20 },
  output: { totalLatencyNs: 2.3 },
} satisfies ToolExample<
  ChipletDieToDieLatencyInput,
  ChipletDieToDieLatencyOutput
>;

export const calculateChipletDieToDieLatency = (
  input: ChipletDieToDieLatencyInput,
): ChipletDieToDieLatencyOutput => {
  const distanceMm = input.distanceMm;
  const propagationDelayPsPerMm = input.propagationDelayPsPerMm ?? 15;
  const interfaceOverheadNs = input.interfaceOverheadNs ?? 2;

  if (!Number.isFinite(distanceMm) || distanceMm <= 0)
    simpleError(
      "distanceMm",
      "Die-to-die distance must be a finite positive number.",
      "invalid_distance",
    );
  if (!Number.isFinite(propagationDelayPsPerMm) || propagationDelayPsPerMm <= 0)
    simpleError(
      "propagationDelayPsPerMm",
      "Propagation delay must be a finite positive number.",
      "invalid_propagation_delay",
    );
  if (!Number.isFinite(interfaceOverheadNs) || interfaceOverheadNs < 0)
    simpleError(
      "interfaceOverheadNs",
      "Interface overhead must be a finite number at least 0 ns.",
      "invalid_overhead",
    );

  const propNs = (distanceMm * propagationDelayPsPerMm) / 1000;
  if (!Number.isFinite(propNs))
    simpleError(
      "distanceMm",
      "Propagation latency overflowed.",
      "numeric_overflow",
    );

  const totalLatencyNs = propNs + interfaceOverheadNs;
  if (!Number.isFinite(totalLatencyNs))
    simpleError(
      "interfaceOverheadNs",
      "Total latency overflowed.",
      "numeric_overflow",
    );

  return { totalLatencyNs: totalLatencyNs === 0 ? 0 : totalLatencyNs };
};

export const chipletDieToDieLatencyTool = createSimpleTool({
  calculate: (input) =>
    calculateChipletDieToDieLatency({
      distanceMm: input.distanceMm as number,
      interfaceOverheadNs:
        (input.interfaceOverheadNs as number | undefined) ?? undefined,
      propagationDelayPsPerMm:
        (input.propagationDelayPsPerMm as number | undefined) ?? undefined,
    }),
  description:
    "Estimate point-to-point chiplet latency as propagation delay times distance divided by 1000 plus fixed interface overhead, total latency in ns where propagation is ps/mm.",
  id: "semiconductor/chiplet-die-to-die-latency",
  inputs: [
    {
      description: "Die-to-die link distance. Must be greater than 0 mm.",
      id: "distanceMm",
      kind: "number",
      label: "Distance",
      minimum: Number.MIN_VALUE,
      unit: "mm",
    },
    {
      default: 2,
      description: "Fixed interface overhead. Must be at least 0 ns.",
      id: "interfaceOverheadNs",
      kind: "number",
      label: "Interface overhead",
      minimum: 0,
      unit: "ns",
    },
    {
      default: 15,
      description:
        "Propagation delay per millimeter. Must be greater than 0 ps/mm.",
      id: "propagationDelayPsPerMm",
      kind: "number",
      label: "Propagation delay",
      minimum: Number.MIN_VALUE,
      unit: "ps/mm",
    },
  ],
  outputs: [
    {
      description: "Total die-to-die latency. At least interface overhead.",
      id: "totalLatencyNs",
      kind: "number",
      label: "Total latency",
      minimum: 0,
      unit: "ns",
    },
  ],
  title: "Chiplet Latency Calculator",
});
export const runChipletDieToDieLatency = chipletDieToDieLatencyTool.execute;
export default chipletDieToDieLatencyTool;
