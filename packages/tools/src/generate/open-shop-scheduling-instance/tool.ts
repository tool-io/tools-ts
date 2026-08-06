import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { createSeededRandom } from "../../random/seeded-number/tool.js";

export const generateOpenShopInstance = (
  jobs: number,
  machines: number,
  minimumTime: number,
  maximumTime: number,
  seed: string,
): number[][] | null => {
  if (!seed.trim() || jobs * machines > 100_000 || maximumTime < minimumTime)
    return null;
  const random = createSeededRandom(seed);
  return Array.from({ length: jobs }, () =>
    Array.from(
      { length: machines },
      () =>
        minimumTime + Math.floor(random() * (maximumTime - minimumTime + 1)),
    ),
  );
};

export const openShopInstanceExample = {
  input: {
    jobs: 2,
    machines: 3,
    maximumTime: 20,
    minimumTime: 1,
    seed: "tool.io",
  },
  output: {
    processingTimes: [
      [4, 14, 6],
      [3, 13, 13],
    ],
  },
} satisfies ToolExample<
  {
    readonly jobs: number;
    readonly machines: number;
    readonly maximumTime: number;
    readonly minimumTime: number;
    readonly seed: string;
  },
  { readonly processingTimes: readonly (readonly number[])[] }
>;

export const openShopInstanceTool = createSimpleTool({
  id: "generate/open-shop-scheduling-instance",
  title: "Open-Shop Scheduling Instance Generator",
  description:
    "Generate a reproducible processing-time matrix for an open-shop scheduling problem.",
  inputs: [
    { id: "jobs", kind: "integer", label: "Jobs", maximum: 1_000, minimum: 1 },
    {
      id: "machines",
      kind: "integer",
      label: "Machines",
      maximum: 1_000,
      minimum: 1,
    },
    {
      id: "minimumTime",
      kind: "integer",
      label: "Minimum processing time",
      minimum: 1,
    },
    {
      id: "maximumTime",
      kind: "integer",
      label: "Maximum processing time",
      minimum: 1,
    },
    { id: "seed", kind: "string", label: "Seed" },
  ],
  outputs: [
    {
      format: "instance/open-shop",
      id: "processingTimes",
      kind: "matrix",
      label: "Processing times",
    },
  ],
  calculate: (input) => {
    const processingTimes = generateOpenShopInstance(
      input.jobs as number,
      input.machines as number,
      input.minimumTime as number,
      input.maximumTime as number,
      input.seed as string,
    );
    if (!processingTimes)
      return simpleError(
        "maximumTime",
        "Enter feasible dimensions, ordered times, and a nonempty seed.",
      );
    return { processingTimes };
  },
});
export const runOpenShopInstance = openShopInstanceTool.execute;
export default openShopInstanceTool;
