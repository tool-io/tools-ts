import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const spiClockFrequencyExample = {
  input: { cpuClockHz: 16000000, divider: 128 },
} satisfies ToolExample<{
  readonly cpuClockHz: number;
  readonly divider: number;
}>;

export const spiClockFrequencyTool = createSimpleTool({
  id: "electronics/spi-clock-frequency",
  title: "SPI Clock Divider",
  description:
    "Compute the SPI clock frequency from the CPU clock and a power-of-two divider between 1 and 256.",
  inputs: [
    {
      id: "cpuClockHz",
      label: "CPU clock frequency",
      kind: "number",
      unit: "Hz",
    },
    {
      id: "divider",
      label: "Divider",
      kind: "integer",
      maximum: 256,
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "spiClockHz",
      label: "SPI clock frequency",
      kind: "number",
      unit: "Hz",
    },
  ],
  calculate: (input) => {
    const cpuClockHz = input.cpuClockHz as number;
    const divider = input.divider as number;
    if (!(cpuClockHz > 0))
      simpleError(
        "cpuClockHz",
        "CPU clock frequency must be positive.",
        "invalid_clock",
      );
    if ((divider & (divider - 1)) !== 0)
      simpleError(
        "divider",
        "Divider must be a power of two.",
        "invalid_divider",
      );
    return { spiClockHz: cpuClockHz / divider };
  },
});
export const runSpiClockFrequency = spiClockFrequencyTool.execute;
export default spiClockFrequencyTool;
