import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const bufferDilutionPhTool = createSimpleTool({
  id: "chemistry/buffer-dilution-ph",
  title: "Buffer Dilution pH Calculator",
  description:
    "Buffer pH remains unchanged upon dilution because Henderson-Hasselbalch ratio is preserved.",
  inputs: [
    { id: "initialPh", label: "Initial pH", kind: "number" },
    {
      id: "dilutionFactor",
      label: "Dilution factor",
      kind: "number",
      minimum: 1,
    },
  ],
  outputs: [{ id: "finalPh", label: "Final pH", kind: "number" }],
  calculate: (input) => {
    return { finalPh: input.initialPh as number };
  },
});
export const runBufferDilutionPh = bufferDilutionPhTool.execute;
export default bufferDilutionPhTool;

export type BufferDilutionPhInput = {
  readonly initialPh: number;
  readonly dilutionFactor: number;
};

export type BufferDilutionPhOutput = {
  readonly finalPh: number;
};

export const bufferDilutionPhExample = {
  input: {
    initialPh: 1,
    dilutionFactor: 1,
  },
  output: {
    finalPh: 1,
  },
} satisfies ToolExample<BufferDilutionPhInput, BufferDilutionPhOutput>;
