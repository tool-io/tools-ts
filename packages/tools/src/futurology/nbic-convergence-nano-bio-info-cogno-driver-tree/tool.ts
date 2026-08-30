import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const convergenceAreas = ["bio", "cogno", "info", "nano"] as const;

export type NbicConvergenceTreeInput = {
  readonly convergenceAreas: ReadonlyArray<string>;
  readonly driverIds: ReadonlyArray<string>;
  readonly parentIndices: ReadonlyArray<number>;
};

export type NbicConvergenceTreeOutput = {
  readonly depthAssignments: ReadonlyArray<string>;
  readonly maximumDepth: number;
  readonly representedAreas: ReadonlyArray<string>;
  readonly representedAreaCount: number;
  readonly validTree: boolean;
};

export const validateNbicConvergenceDriverTree = (
  input: NbicConvergenceTreeInput,
): NbicConvergenceTreeOutput => {
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
      "Each driver must have one parent index.",
      "tree_data_length_mismatch",
    );
  if (
    !Array.isArray(input.convergenceAreas) ||
    input.convergenceAreas.length !== input.driverIds.length
  )
    simpleError(
      "convergenceAreas",
      "Each driver must have one convergence area.",
      "convergence_areas_length_mismatch",
    );
  const driverIds = input.driverIds.map((driverId, index) => {
    if (typeof driverId !== "string" || driverId.trim() === "")
      simpleError(
        `driverIds.${index}`,
        "Driver IDs must be nonempty strings.",
        "invalid_driver_id",
      );
    return driverId.trim();
  });
  if (new Set(driverIds).size !== driverIds.length)
    simpleError(
      "driverIds",
      "Driver IDs must be unique.",
      "duplicate_driver_id",
    );
  const normalizedAreas = input.convergenceAreas.map((area, index) => {
    if (
      typeof area !== "string" ||
      !convergenceAreas.includes(
        area.trim().toLowerCase() as (typeof convergenceAreas)[number],
      )
    )
      simpleError(
        `convergenceAreas.${index}`,
        "Convergence areas must be bio, cogno, info, or nano.",
        "invalid_convergence_area",
      );
    return area.trim().toLowerCase();
  });
  for (const [index, parentIndex] of input.parentIndices.entries())
    if (
      !Number.isSafeInteger(parentIndex) ||
      parentIndex < -1 ||
      parentIndex >= driverIds.length
    )
      simpleError(
        `parentIndices.${index}`,
        "Parent indices must be -1 or a valid driver index.",
        "invalid_parent_index",
      );
  const rootCount = input.parentIndices.filter(
    (parentIndex) => parentIndex === -1,
  ).length;
  const depthAssignments: string[] = [];
  let maximumDepth = 0;
  let validTree = rootCount === 1;
  for (const [startIndex, driverId] of driverIds.entries()) {
    let currentIndex = startIndex;
    let depth = 0;
    const visitedDriverIndices = new Set<number>();
    while (input.parentIndices[currentIndex] !== -1) {
      if (visitedDriverIndices.has(currentIndex) || depth >= driverIds.length) {
        validTree = false;
        break;
      }
      visitedDriverIndices.add(currentIndex);
      currentIndex = input.parentIndices[currentIndex]!;
      depth += 1;
    }
    depthAssignments.push(`${driverId}: ${depth}`);
    maximumDepth = Math.max(maximumDepth, depth);
  }
  const representedAreas = convergenceAreas.filter((area) =>
    normalizedAreas.includes(area),
  );
  return {
    depthAssignments,
    maximumDepth,
    representedAreas,
    representedAreaCount: representedAreas.length,
    validTree,
  };
};

export const nbicConvergenceTreeExample = {
  input: {
    convergenceAreas: ["info", "cogno", "bio"],
    driverIds: ["Convergence", "AI biology", "Neural interface"],
    parentIndices: [-1, 0, 0],
  },
  output: {
    depthAssignments: [
      "Convergence: 0",
      "AI biology: 1",
      "Neural interface: 1",
    ],
    maximumDepth: 1,
    representedAreas: ["bio", "cogno", "info"],
    representedAreaCount: 3,
    validTree: true,
  },
} satisfies ToolExample<NbicConvergenceTreeInput, NbicConvergenceTreeOutput>;

export const nbicConvergenceTreeTool = createSimpleTool({
  calculate: (input) =>
    validateNbicConvergenceDriverTree({
      convergenceAreas: input.convergenceAreas as string[],
      driverIds: input.driverIds as string[],
      parentIndices: input.parentIndices as number[],
    }),
  description:
    "Validate an NBIC driver tree and report node depths plus represented nano, bio, info, and cogno areas.",
  id: "futurology/nbic-convergence-nano-bio-info-cogno-driver-tree",
  inputs: [
    {
      description: "One bio, cogno, info, or nano label per driver.",
      id: "convergenceAreas",
      kind: "stringList",
      label: "Convergence areas",
    },
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
    { id: "representedAreas", kind: "stringList", label: "Represented areas" },
    {
      id: "representedAreaCount",
      kind: "integer",
      label: "Represented area count",
      minimum: 0,
      maximum: 4,
    },
    { id: "validTree", kind: "boolean", label: "Valid single-root tree" },
  ],
  title: "NBIC Convergence Nano Bio Info Cogno Driver Tree",
});

export const runNbicConvergenceTree = nbicConvergenceTreeTool.execute;
export default nbicConvergenceTreeTool;
