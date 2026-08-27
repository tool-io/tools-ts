import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type BjtEmitterCurrentInput = {
  readonly baseCurrentA: number;
  readonly collectorCurrentA: number;
};

export type BjtEmitterCurrentOutput = {
  readonly emitterCurrentA: number;
};

export const bjtEmitterCurrentExample = {
  input: { baseCurrentA: 0.00001, collectorCurrentA: 0.001 },
  output: { emitterCurrentA: 0.00101 },
} satisfies ToolExample<BjtEmitterCurrentInput, BjtEmitterCurrentOutput>;

export const calculateBjtEmitterCurrent = (
  input: BjtEmitterCurrentInput,
): BjtEmitterCurrentOutput => ({
  emitterCurrentA: input.baseCurrentA + input.collectorCurrentA,
});

export const bjtEmitterCurrentTool = createSimpleTool({
  calculate: (input) =>
    calculateBjtEmitterCurrent(input as unknown as BjtEmitterCurrentInput),
  description: "Calculate BJT emitter current.",
  id: "electronics/bjt-emitter-current",
  inputs: [
    { id: "baseCurrentA", kind: "number", label: "Base current", unit: "A" },
    {
      id: "collectorCurrentA",
      kind: "number",
      label: "Collector current",
      unit: "A",
    },
  ],
  outputs: [
    {
      id: "emitterCurrentA",
      kind: "number",
      label: "Emitter current",
      unit: "A",
    },
  ],
  title: "BJT Emitter Current",
});
export const runBjtEmitterCurrent = bjtEmitterCurrentTool.execute;
export default bjtEmitterCurrentTool;
