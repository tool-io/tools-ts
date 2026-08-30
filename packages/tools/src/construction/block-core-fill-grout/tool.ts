import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BlockCoreFillGroutInput = Readonly<{
  readonly blockCount: number;
  readonly fillableVoidPerBlockM3: number;
}>;
export type BlockCoreFillGroutOutput = Readonly<{
  readonly groutVolumeM3: number;
}>;

export const calculateBlockCoreFillGrout = (
  x: BlockCoreFillGroutInput,
): BlockCoreFillGroutOutput => {
  if (!Number.isSafeInteger(x.blockCount) || x.blockCount < 0)
    simpleError("blockCount", "Provide a safe integer at least 0.");
  if (
    !Number.isFinite(x.fillableVoidPerBlockM3) ||
    x.fillableVoidPerBlockM3 < 0
  )
    simpleError(
      "fillableVoidPerBlockM3",
      "Provide a finite number at least 0.",
    );
  const groutVolumeM3 = x.blockCount * x.fillableVoidPerBlockM3;
  if (!Number.isFinite(groutVolumeM3))
    simpleError("groutVolumeM3", "The inputs produce an invalid result.");
  return { groutVolumeM3: Object.is(groutVolumeM3, -0) ? 0 : groutVolumeM3 };
};

export const example = {
  input: { blockCount: 100, fillableVoidPerBlockM3: 0.004 },
  output: { groutVolumeM3: 0.4 },
} satisfies ToolExample<BlockCoreFillGroutInput, BlockCoreFillGroutOutput>;

export const tool = createSimpleTool({
  id: "construction/block-core-fill-grout",
  title: "Block Core Fill Grout",
  description:
    "Calculate grout needed for fully filled block cores from block count and net fillable void per block.",
  inputs: [
    { id: "blockCount", kind: "integer", label: "Blocks", minimum: 0 },
    {
      id: "fillableVoidPerBlockM3",
      kind: "number",
      label: "Fillable void per block",
      unit: "m³",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "groutVolumeM3",
      kind: "number",
      label: "Core-fill grout volume",
      unit: "m³",
    },
  ],
  calculate: (input) =>
    calculateBlockCoreFillGrout({
      blockCount: input.blockCount as number,
      fillableVoidPerBlockM3: input.fillableVoidPerBlockM3 as number,
    }),
});
export const blockCoreFillGroutTool = tool;
export const runBlockCoreFillGrout = tool.execute;
export default tool;
