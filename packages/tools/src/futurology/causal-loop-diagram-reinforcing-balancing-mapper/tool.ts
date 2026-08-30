import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CausalLoopMapperInput = {
  readonly loopIds: ReadonlyArray<string>;
  readonly loopSignProducts: ReadonlyArray<number>;
};

export type CausalLoopMapperOutput = {
  readonly balancingLoopIds: ReadonlyArray<string>;
  readonly loopClassifications: ReadonlyArray<string>;
  readonly reinforcingLoopIds: ReadonlyArray<string>;
  readonly validLoopCount: number;
};

export const classifyCausalLoops = (
  input: CausalLoopMapperInput,
): CausalLoopMapperOutput => {
  if (!Array.isArray(input.loopIds) || !Array.isArray(input.loopSignProducts))
    simpleError(
      "",
      "Loop IDs and signs must be arrays.",
      "causal_loop_data_required",
    );
  if (
    input.loopIds.length === 0 ||
    input.loopIds.length !== input.loopSignProducts.length
  )
    simpleError(
      "loopSignProducts",
      "Each loop must have one sign.",
      "causal_loop_length_mismatch",
    );
  const loopIds = input.loopIds.map((loopId, index) => {
    if (typeof loopId !== "string" || loopId.trim() === "")
      simpleError(
        `loopIds.${index}`,
        "Loop IDs must be nonempty strings.",
        "invalid_loop_id",
      );
    return loopId.trim();
  });
  if (new Set(loopIds).size !== loopIds.length)
    simpleError("loopIds", "Loop IDs must be unique.", "duplicate_loop_id");
  const reinforcingLoopIds: string[] = [];
  const balancingLoopIds: string[] = [];
  const loopClassifications: string[] = [];
  for (const [index, signProduct] of input.loopSignProducts.entries()) {
    if (signProduct !== -1 && signProduct !== 1)
      simpleError(
        `loopSignProducts.${index}`,
        "Loop sign products must be -1 or 1.",
        "invalid_loop_sign",
      );
    if (signProduct === 1) {
      reinforcingLoopIds.push(loopIds[index]!);
      loopClassifications.push(`${loopIds[index]}: reinforcing`);
    } else {
      balancingLoopIds.push(loopIds[index]!);
      loopClassifications.push(`${loopIds[index]}: balancing`);
    }
  }
  return {
    balancingLoopIds,
    loopClassifications,
    reinforcingLoopIds,
    validLoopCount: loopIds.length,
  };
};

export const causalLoopMapperExample = {
  input: {
    loopIds: ["Adoption growth", "Capacity constraint", "Price response"],
    loopSignProducts: [1, -1, -1],
  },
  output: {
    balancingLoopIds: ["Capacity constraint", "Price response"],
    loopClassifications: [
      "Adoption growth: reinforcing",
      "Capacity constraint: balancing",
      "Price response: balancing",
    ],
    reinforcingLoopIds: ["Adoption growth"],
    validLoopCount: 3,
  },
} satisfies ToolExample<CausalLoopMapperInput, CausalLoopMapperOutput>;

export const causalLoopMapperTool = createSimpleTool({
  calculate: (input) =>
    classifyCausalLoops({
      loopIds: input.loopIds as string[],
      loopSignProducts: input.loopSignProducts as number[],
    }),
  description:
    "Classify caller-supplied causal loops as reinforcing or balancing from the product of each loop's link signs.",
  id: "futurology/causal-loop-diagram-reinforcing-balancing-mapper",
  inputs: [
    { id: "loopIds", kind: "stringList", label: "Loop IDs" },
    {
      description: "One -1 or 1 per-loop product of all causal-link signs.",
      id: "loopSignProducts",
      kind: "numberList",
      label: "Loop sign products",
    },
  ],
  outputs: [
    { id: "balancingLoopIds", kind: "stringList", label: "Balancing loops" },
    {
      id: "loopClassifications",
      kind: "stringList",
      label: "Loop classifications",
    },
    {
      id: "reinforcingLoopIds",
      kind: "stringList",
      label: "Reinforcing loops",
    },
    {
      id: "validLoopCount",
      kind: "integer",
      label: "Classified loops",
      minimum: 1,
    },
  ],
  title: "Causal Loop Diagram Reinforcing Balancing Mapper",
});

export const runCausalLoopMapper = causalLoopMapperTool.execute;
export default causalLoopMapperTool;
