import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScenarioCoherenceInput = {
  readonly coherenceGroupIds: ReadonlyArray<string>;
  readonly driverIds: ReadonlyArray<string>;
  readonly effectSigns: ReadonlyArray<ReadonlyArray<number>>;
  readonly outcomeIds: ReadonlyArray<string>;
};

export type ScenarioCoherenceOutput = {
  readonly activeEffectCount: number;
  readonly coherent: boolean;
  readonly contradictionPairs: ReadonlyArray<string>;
  readonly inconsistentDriverIds: ReadonlyArray<string>;
};

export const checkScenarioDriverCoherence = (
  input: ScenarioCoherenceInput,
): ScenarioCoherenceOutput => {
  if (!Array.isArray(input.driverIds) || input.driverIds.length === 0)
    simpleError(
      "driverIds",
      "At least one driver ID is required.",
      "driver_ids_required",
    );
  if (
    !Array.isArray(input.coherenceGroupIds) ||
    input.coherenceGroupIds.length !== input.driverIds.length
  )
    simpleError(
      "coherenceGroupIds",
      "Each driver must have one coherence group.",
      "coherence_groups_length_mismatch",
    );
  if (!Array.isArray(input.outcomeIds) || input.outcomeIds.length === 0)
    simpleError(
      "outcomeIds",
      "At least one outcome ID is required.",
      "outcome_ids_required",
    );
  if (
    !Array.isArray(input.effectSigns) ||
    input.effectSigns.length !== input.driverIds.length
  )
    simpleError(
      "effectSigns",
      "Each driver must have one effect-sign row.",
      "effect_signs_length_mismatch",
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
  const groupIds = input.coherenceGroupIds.map((groupId, index) => {
    if (typeof groupId !== "string" || groupId.trim() === "")
      simpleError(
        `coherenceGroupIds.${index}`,
        "Coherence groups must be nonempty strings.",
        "invalid_coherence_group",
      );
    return groupId.trim();
  });
  const outcomeIds = input.outcomeIds.map((outcomeId, index) => {
    if (typeof outcomeId !== "string" || outcomeId.trim() === "")
      simpleError(
        `outcomeIds.${index}`,
        "Outcome IDs must be nonempty strings.",
        "invalid_outcome_id",
      );
    return outcomeId.trim();
  });
  for (const [rowIndex, row] of input.effectSigns.entries()) {
    if (!Array.isArray(row) || row.length !== outcomeIds.length)
      simpleError(
        `effectSigns.${rowIndex}`,
        "Each effect-sign row must match the outcome count.",
        "invalid_effect_sign_row",
      );
    for (const [columnIndex, sign] of row.entries())
      if (sign !== -1 && sign !== 0 && sign !== 1)
        simpleError(
          `effectSigns.${rowIndex}.${columnIndex}`,
          "Effect signs must be -1, 0, or 1.",
          "invalid_effect_sign",
        );
  }
  const inconsistentDriverIndices = new Set<number>();
  const contradictionPairs: string[] = [];
  for (const [rowIndex, row] of input.effectSigns.entries()) {
    for (
      let comparisonIndex = rowIndex + 1;
      comparisonIndex < input.effectSigns.length;
      comparisonIndex += 1
    ) {
      if (groupIds[rowIndex] !== groupIds[comparisonIndex]) continue;
      for (
        let outcomeIndex = 0;
        outcomeIndex < outcomeIds.length;
        outcomeIndex += 1
      ) {
        const firstSign = row[outcomeIndex]!;
        const secondSign = input.effectSigns[comparisonIndex]![outcomeIndex]!;
        if (firstSign === 0 || secondSign === 0 || firstSign === secondSign)
          continue;
        inconsistentDriverIndices.add(rowIndex);
        inconsistentDriverIndices.add(comparisonIndex);
        contradictionPairs.push(
          `${driverIds[rowIndex]} vs ${driverIds[comparisonIndex]} on ${outcomeIds[outcomeIndex]}`,
        );
      }
    }
  }
  return {
    activeEffectCount: input.effectSigns.reduce(
      (total, row) => total + row.filter((sign) => sign !== 0).length,
      0,
    ),
    coherent: contradictionPairs.length === 0,
    contradictionPairs,
    inconsistentDriverIds: [...inconsistentDriverIndices].map(
      (index) => driverIds[index]!,
    ),
  };
};

export const scenarioCoherenceExample = {
  input: {
    coherenceGroupIds: ["demand", "supply", "demand"],
    driverIds: ["Adoption", "Capacity", "Cost"],
    effectSigns: [
      [1, 1],
      [1, 1],
      [-1, -1],
    ],
    outcomeIds: ["Volume", "Price"],
  },
  output: {
    activeEffectCount: 6,
    coherent: false,
    contradictionPairs: [
      "Adoption vs Cost on Volume",
      "Adoption vs Cost on Price",
    ],
    inconsistentDriverIds: ["Adoption", "Cost"],
  },
} satisfies ToolExample<ScenarioCoherenceInput, ScenarioCoherenceOutput>;

export const scenarioCoherenceTool = createSimpleTool({
  calculate: (input) =>
    checkScenarioDriverCoherence({
      coherenceGroupIds: input.coherenceGroupIds as string[],
      driverIds: input.driverIds as string[],
      effectSigns: input.effectSigns as number[][],
      outcomeIds: input.outcomeIds as string[],
    }),
  description:
    "Check whether drivers assigned to the same coherence group use consistent signed effects on shared outcomes.",
  id: "futurology/scenario-consistency-driver-coherence-checker",
  inputs: [
    {
      description: "One coherence-group label per driver.",
      id: "coherenceGroupIds",
      kind: "stringList",
      label: "Coherence group IDs",
    },
    { id: "driverIds", kind: "stringList", label: "Driver IDs" },
    {
      description: "A driver-by-outcome matrix containing -1, 0, or 1.",
      id: "effectSigns",
      kind: "matrix",
      label: "Driver effect signs",
    },
    { id: "outcomeIds", kind: "stringList", label: "Outcome IDs" },
  ],
  outputs: [
    {
      id: "activeEffectCount",
      kind: "integer",
      label: "Active effects",
      minimum: 0,
    },
    { id: "coherent", kind: "boolean", label: "Scenario coherent" },
    {
      id: "contradictionPairs",
      kind: "stringList",
      label: "Contradictory driver-outcome pairs",
    },
    {
      id: "inconsistentDriverIds",
      kind: "stringList",
      label: "Inconsistent driver IDs",
    },
  ],
  title: "Scenario Consistency Driver Coherence Checker",
});

export const runScenarioCoherence = scenarioCoherenceTool.execute;
export default scenarioCoherenceTool;
