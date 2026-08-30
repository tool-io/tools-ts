import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CircuitLoadAmpsInput = Readonly<{
  readonly loadPowerW: number;
  readonly voltageV: number;
}>;
export type CircuitLoadAmpsOutput = Readonly<{
  readonly currentA: number;
}>;

export const calculateCircuitLoadAmps = (
  x: CircuitLoadAmpsInput,
): CircuitLoadAmpsOutput => {
  if (!Number.isFinite(x.loadPowerW) || x.loadPowerW < 0)
    simpleError("loadPowerW", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.voltageV) || x.voltageV < 0)
    simpleError("voltageV", "Provide a finite number at least 0.");
  if (!(x.voltageV > 0)) simpleError("voltageV", "Voltage must be positive.");
  const currentA = x.loadPowerW / x.voltageV;
  if (!Number.isFinite(currentA))
    simpleError("currentA", "The inputs produce an invalid result.");
  return { currentA: Object.is(currentA, -0) ? 0 : currentA };
};

export const example = {
  input: { loadPowerW: 1200, voltageV: 120 },
  output: { currentA: 10 },
} satisfies ToolExample<CircuitLoadAmpsInput, CircuitLoadAmpsOutput>;

export const tool = createSimpleTool({
  id: "construction/circuit-load-amps",
  title: "Circuit Load Amps",
  description:
    "Convert electrical load power to current for a DC circuit or AC load with unity power factor; does not size a breaker.",
  inputs: [
    {
      id: "loadPowerW",
      kind: "number",
      label: "Load power",
      unit: "W",
      minimum: 0,
    },
    {
      id: "voltageV",
      kind: "number",
      label: "Supply voltage",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "currentA", kind: "number", label: "Load current", unit: "A" },
  ],
  calculate: (input) =>
    calculateCircuitLoadAmps({
      loadPowerW: input.loadPowerW as number,
      voltageV: input.voltageV as number,
    }),
});
export const circuitLoadAmpsTool = tool;
export const runCircuitLoadAmps = tool.execute;
export default tool;
