import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FixedAssetSightInput = {
  readonly observedAssetIds: ReadonlyArray<string>;
  readonly selectedAssetIds: ReadonlyArray<string>;
};

export type FixedAssetSightOutput = {
  readonly complete: boolean;
  readonly observedCount: number;
  readonly selectedCount: number;
  readonly unobservedAssetIds: ReadonlyArray<string>;
};

export const verifyFixedAssetSightObservations = (
  input: FixedAssetSightInput,
): FixedAssetSightOutput => {
  if (
    !Array.isArray(input.selectedAssetIds) ||
    !Array.isArray(input.observedAssetIds)
  )
    simpleError(
      "",
      "Selected and observed asset IDs must be arrays.",
      "asset_data_required",
    );
  const selected: string[] = [];
  for (const [index, id] of input.selectedAssetIds.entries()) {
    if (typeof id !== "string" || id.trim() === "")
      simpleError(
        `selectedAssetIds.${index}`,
        "Selected asset IDs must be nonempty strings.",
        "invalid_asset_id",
      );
    const normalized = id.trim();
    if (selected.includes(normalized))
      simpleError(
        `selectedAssetIds.${index}`,
        "Selected asset IDs must be unique.",
        "duplicate_asset_id",
      );
    selected.push(normalized);
  }
  const observed = new Set<string>();
  for (const [index, id] of input.observedAssetIds.entries()) {
    if (typeof id !== "string" || !selected.includes(id.trim()))
      simpleError(
        `observedAssetIds.${index}`,
        "Observed asset IDs must identify selected assets.",
        "unselected_observed_asset",
      );
    observed.add(id.trim());
  }
  const unobservedAssetIds = selected.filter((id) => !observed.has(id));
  return {
    complete: unobservedAssetIds.length === 0,
    observedCount: observed.size,
    selectedCount: selected.length,
    unobservedAssetIds,
  };
};

export const fixedAssetSightExample = {
  input: {
    observedAssetIds: ["FA-100", "FA-102"],
    selectedAssetIds: ["FA-100", "FA-101", "FA-102"],
  },
  output: {
    complete: false,
    observedCount: 2,
    selectedCount: 3,
    unobservedAssetIds: ["FA-101"],
  },
} satisfies ToolExample<FixedAssetSightInput, FixedAssetSightOutput>;

export const fixedAssetSightTool = createSimpleTool({
  calculate: (input) =>
    verifyFixedAssetSightObservations({
      observedAssetIds: input.observedAssetIds as string[],
      selectedAssetIds: input.selectedAssetIds as string[],
    }),
  description:
    "Match selected fixed-asset IDs to recorded sight observations and report every unobserved selected asset.",
  id: "auditing/fixed-asset-existence-floor-sample-sight-verification",
  inputs: [
    {
      description: "Selected asset IDs with a recorded sight observation.",
      id: "observedAssetIds",
      kind: "stringList",
      label: "Observed asset IDs",
    },
    {
      description: "Unique fixed-asset IDs selected for physical observation.",
      id: "selectedAssetIds",
      kind: "stringList",
      label: "Selected asset IDs",
    },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "All selected assets observed" },
    {
      id: "observedCount",
      kind: "integer",
      label: "Observed assets",
      minimum: 0,
    },
    {
      id: "selectedCount",
      kind: "integer",
      label: "Selected assets",
      minimum: 0,
    },
    {
      id: "unobservedAssetIds",
      kind: "stringList",
      label: "Unobserved asset IDs",
    },
  ],
  title: "Fixed Asset Existence Floor Sample Sight Verification",
});

export const runFixedAssetSight = fixedAssetSightTool.execute;
export default fixedAssetSightTool;
