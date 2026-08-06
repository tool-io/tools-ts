import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { createSeededRandom } from "../../random/seeded-number/tool.js";

export type BinPackingInstance = {
  readonly capacity: number;
  readonly items: readonly number[];
};
export const generateBinPackingInstance = (
  itemCount: number,
  minimum: number,
  maximum: number,
  capacity: number,
  seed: string,
): BinPackingInstance | null => {
  if (!seed.trim() || maximum < minimum || maximum > capacity) return null;
  const random = createSeededRandom(seed);
  return {
    capacity,
    items: Array.from({ length: itemCount }, () =>
      Number((minimum + random() * (maximum - minimum)).toPrecision(8)),
    ),
  };
};

export const binPackingInstanceExample = {
  input: {
    capacity: 15,
    itemCount: 4,
    maximum: 10,
    minimum: 1,
    seed: "tool.io",
  },
  output: {
    instance: {
      capacity: 15,
      items: [2.3883892, 7.1556896, 3.2967196, 2.1690708],
    },
  },
} satisfies ToolExample<
  {
    readonly capacity: number;
    readonly itemCount: number;
    readonly maximum: number;
    readonly minimum: number;
    readonly seed: string;
  },
  { readonly instance: BinPackingInstance }
>;

export const binPackingInstanceTool = createSimpleTool({
  id: "generate/bin-packing-instance",
  title: "Bin Packing Instance Generator",
  description: "Generate reproducible one-dimensional bin-packing item sizes.",
  inputs: [
    {
      id: "itemCount",
      kind: "integer",
      label: "Item count",
      maximum: 100_000,
      minimum: 1,
    },
    {
      id: "minimum",
      kind: "number",
      label: "Minimum size",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "maximum",
      kind: "number",
      label: "Maximum size",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "capacity",
      kind: "number",
      label: "Bin capacity",
      minimum: Number.MIN_VALUE,
    },
    { id: "seed", kind: "string", label: "Seed" },
  ],
  outputs: [
    {
      format: "instance/bin-packing",
      id: "instance",
      kind: "object",
      label: "Instance",
    },
  ],
  calculate: (input) => {
    const instance = generateBinPackingInstance(
      input.itemCount as number,
      input.minimum as number,
      input.maximum as number,
      input.capacity as number,
      input.seed as string,
    );
    if (!instance)
      return simpleError(
        "maximum",
        "Maximum size must be at least the minimum and no greater than capacity.",
      );
    return { instance };
  },
});
export const runBinPackingInstance = binPackingInstanceTool.execute;
export default binPackingInstanceTool;
