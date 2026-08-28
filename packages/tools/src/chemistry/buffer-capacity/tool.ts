import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BufferCapacityInput = {
  readonly hPlus: number;
  readonly ka: number;
  readonly totalConcentrationM: number;
};

export type BufferCapacityOutput = {
  readonly bufferCapacity: number;
};

export const bufferCapacityExample = {
  input: { hPlus: 1e-5, ka: 1e-5, totalConcentrationM: 0.2 },
  output: { bufferCapacity: 0.11515 },
} satisfies ToolExample<BufferCapacityInput, BufferCapacityOutput>;

export const bufferCapacityTool = createSimpleTool({
  id: "chemistry/buffer-capacity",
  title: "Buffer Capacity Estimate",
  description:
    "Estimate buffer capacity from total buffer concentration, Ka, and hydrogen ion concentration.",
  inputs: [
    {
      id: "hPlus",
      label: "Hydrogen ion concentration",
      kind: "number",
      unit: "M",
    },
    { id: "ka", label: "Ka", kind: "number" },
    {
      id: "totalConcentrationM",
      label: "Total buffer concentration",
      kind: "number",
      unit: "M",
    },
  ],
  outputs: [{ id: "bufferCapacity", label: "Buffer capacity", kind: "number" }],
  calculate: (input) => {
    const hPlus = input.hPlus as number;
    const ka = input.ka as number;
    const totalConcentrationM = input.totalConcentrationM as number;
    if (hPlus <= 0)
      simpleError("hPlus", "Hydrogen ion concentration must be positive.");
    if (ka <= 0) simpleError("ka", "Ka must be positive.");
    if (totalConcentrationM <= 0)
      simpleError(
        "totalConcentrationM",
        "Total concentration must be positive.",
      );
    return {
      bufferCapacity:
        (2.303 * totalConcentrationM * (ka * hPlus)) / Math.pow(ka + hPlus, 2),
    };
  },
});
export const runBufferCapacity = bufferCapacityTool.execute;
export default bufferCapacityTool;
