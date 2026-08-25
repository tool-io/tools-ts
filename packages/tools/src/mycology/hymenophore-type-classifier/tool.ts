import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const HYMENOPHORE_TYPES = [
  "lamellate",
  "poroid",
  "hydnoid",
  "smooth",
  "folded",
  "toothed",
] as const;

type HymenophoreType = (typeof HYMENOPHORE_TYPES)[number];

export type HymenophoreTypeClassifierInput = {
  readonly type: HymenophoreType;
};

export type HymenophoreTypeClassifierOutput = {
  readonly hymenophoreClass: HymenophoreType;
};

export const hymenophoreTypeClassifierExample = {
  input: { type: "lamellate" },
  output: { hymenophoreClass: "lamellate" },
} satisfies ToolExample<
  HymenophoreTypeClassifierInput,
  HymenophoreTypeClassifierOutput
>;

export const hymenophoreTypeClassifierTool = createSimpleTool({
  id: "mycology/hymenophore-type-classifier",
  title: "Hymenophore Type",
  description:
    "Classify the spore-bearing surface of a mushroom fruiting body.",
  inputs: [
    {
      enum: HYMENOPHORE_TYPES,
      id: "type",
      kind: "string",
      label: "Type",
    },
  ],
  outputs: [
    {
      enum: HYMENOPHORE_TYPES,
      id: "hymenophoreClass",
      kind: "string",
      label: "Hymenophore class",
    },
  ],
  calculate: (input) => {
    return { hymenophoreClass: input.type as HymenophoreType };
  },
});
export const runHymenophoreTypeClassifier =
  hymenophoreTypeClassifierTool.execute;
export default hymenophoreTypeClassifierTool;
