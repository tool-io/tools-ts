import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { createSeededRandom } from "../../random/seeded-number/tool.js";

export type Box3d = {
  readonly depth: number;
  readonly height: number;
  readonly width: number;
};
export type BinPacking3dInstance = {
  readonly bin: Box3d;
  readonly boxes: readonly Box3d[];
};

export const generate3dBinPackingInstance = (
  count: number,
  bin: Box3d,
  minimum: number,
  seed: string,
): BinPacking3dInstance | null => {
  if (
    !seed.trim() ||
    minimum <= 0 ||
    minimum > Math.min(bin.width, bin.height, bin.depth)
  )
    return null;
  const random = createSeededRandom(seed);
  const dimension = (maximum: number) =>
    Number((minimum + random() * (maximum - minimum)).toPrecision(8));
  return {
    bin,
    boxes: Array.from({ length: count }, () => ({
      depth: dimension(bin.depth),
      height: dimension(bin.height),
      width: dimension(bin.width),
    })),
  };
};

export const threeDimensionalBinPackingInstanceExample = {
  input: {
    binDepth: 8,
    binHeight: 9,
    binWidth: 10,
    boxCount: 2,
    minimumDimension: 1,
    seed: "tool.io",
  },
  output: {
    instance: {
      bin: { depth: 8, height: 9, width: 10 },
      boxes: [
        { depth: 2.0798582, height: 6.4717241, width: 3.2967196 },
        { depth: 1.9092773, height: 5.9531751, width: 6.5735694 },
      ],
    },
  },
} satisfies ToolExample<
  {
    readonly binDepth: number;
    readonly binHeight: number;
    readonly binWidth: number;
    readonly boxCount: number;
    readonly minimumDimension: number;
    readonly seed: string;
  },
  { readonly instance: BinPacking3dInstance }
>;

export const threeDimensionalBinPackingInstanceTool = createSimpleTool({
  id: "generate/3d-bin-packing-instance",
  title: "3D Bin Packing Instance Generator",
  description:
    "Generate reproducible rectangular boxes bounded by a three-dimensional bin.",
  inputs: [
    {
      id: "boxCount",
      kind: "integer",
      label: "Box count",
      maximum: 100_000,
      minimum: 1,
    },
    {
      id: "binWidth",
      kind: "number",
      label: "Bin width",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "binHeight",
      kind: "number",
      label: "Bin height",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "binDepth",
      kind: "number",
      label: "Bin depth",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "minimumDimension",
      kind: "number",
      label: "Minimum box dimension",
      minimum: Number.MIN_VALUE,
    },
    { id: "seed", kind: "string", label: "Seed" },
  ],
  outputs: [
    {
      format: "instance/bin-packing-3d",
      id: "instance",
      kind: "object",
      label: "Instance",
    },
  ],
  calculate: (input) => {
    const instance = generate3dBinPackingInstance(
      input.boxCount as number,
      {
        depth: input.binDepth as number,
        height: input.binHeight as number,
        width: input.binWidth as number,
      },
      input.minimumDimension as number,
      input.seed as string,
    );
    if (!instance)
      return simpleError(
        "minimumDimension",
        "Minimum dimension must fit every bin dimension.",
      );
    return { instance };
  },
});
export const runThreeDimensionalBinPackingInstance =
  threeDimensionalBinPackingInstanceTool.execute;
export default threeDimensionalBinPackingInstanceTool;
