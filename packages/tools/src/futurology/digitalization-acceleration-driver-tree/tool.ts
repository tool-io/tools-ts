import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DigitalizationTreeInput = {
  readonly driverIds: ReadonlyArray<string>;
  readonly parentIndices: ReadonlyArray<number>;
};

export type DigitalizationTreeOutput = {
  readonly depthAssignments: ReadonlyArray<string>;
  readonly maximumDepth: number;
  readonly rootCount: number;
  readonly validTree: boolean;
};

export const validateDigitalizationDriverTree = (
  input: DigitalizationTreeInput,
): DigitalizationTreeOutput => {
  if (!Array.isArray(input.driverIds) || !Array.isArray(input.parentIndices))
    simpleError(
      "",
      "Driver IDs and parent indices must be arrays.",
      "tree_data_required",
    );
  if (
    input.driverIds.length === 0 ||
    input.driverIds.length !== input.parentIndices.length
  )
    simpleError(
      "parentIndices",
      "Each nonempty driver must have one parent index.",
      "tree_data_length_mismatch",
    );
  const ids = input.driverIds.map((id, index) => {
    if (typeof id !== "string" || id.trim() === "")
      simpleError(
        `driverIds.${index}`,
        "Driver IDs must be nonempty strings.",
        "invalid_driver_id",
      );
    return id.trim();
  });
  for (const [index, parent] of input.parentIndices.entries())
    if (!Number.isSafeInteger(parent) || parent < -1 || parent >= ids.length)
      simpleError(
        `parentIndices.${index}`,
        "Parent indices must be -1 or a valid driver index.",
        "invalid_parent_index",
      );
  const roots = input.parentIndices
    .map((parent, index) => (parent === -1 ? index : -1))
    .filter((index) => index >= 0);
  const depthAssignments: string[] = [];
  let maximumDepth = 0;
  let validTree = roots.length === 1;
  for (const [start, id] of ids.entries()) {
    let depth = 0;
    let current = start;
    const visited = new Set<number>();
    while (input.parentIndices[current] !== -1) {
      if (visited.has(current)) {
        validTree = false;
        break;
      }
      visited.add(current);
      current = input.parentIndices[current]!;
      depth += 1;
      if (depth > ids.length) {
        validTree = false;
        break;
      }
    }
    depthAssignments.push(`${id}: ${depth}`);
    maximumDepth = Math.max(maximumDepth, depth);
  }
  return { depthAssignments, maximumDepth, rootCount: roots.length, validTree };
};

export const digitalizationTreeExample = {
  input: {
    driverIds: ["Compute", "AI", "Robotics"],
    parentIndices: [-1, 0, 0],
  },
  output: {
    depthAssignments: ["Compute: 0", "AI: 1", "Robotics: 1"],
    maximumDepth: 1,
    rootCount: 1,
    validTree: true,
  },
} satisfies ToolExample<DigitalizationTreeInput, DigitalizationTreeOutput>;

export const digitalizationTreeTool = createSimpleTool({
  calculate: (input) =>
    validateDigitalizationDriverTree({
      driverIds: input.driverIds as string[],
      parentIndices: input.parentIndices as number[],
    }),
  description:
    "Validate a single-root digitalization driver tree from parent indices and report each node's depth and maximum tree depth.",
  id: "futurology/digitalization-acceleration-driver-tree",
  inputs: [
    { id: "driverIds", kind: "stringList", label: "Driver IDs" },
    {
      description: "One -1 root marker or valid parent index per driver.",
      id: "parentIndices",
      kind: "numberList",
      label: "Parent indices",
    },
  ],
  outputs: [
    { id: "depthAssignments", kind: "stringList", label: "Driver depths" },
    { id: "maximumDepth", kind: "integer", label: "Maximum depth", minimum: 0 },
    { id: "rootCount", kind: "integer", label: "Root count", minimum: 0 },
    { id: "validTree", kind: "boolean", label: "Valid single-root tree" },
  ],
  title: "Digitalization Acceleration Driver Tree",
});

export const runDigitalizationTree = digitalizationTreeTool.execute;
export default digitalizationTreeTool;
