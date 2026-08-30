import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly liabilitySatisfied: boolean;
  readonly collectionPeriodExpired: boolean;
  readonly publicNoticeRemoved: boolean;
}>;
export type Output = Readonly<{
  readonly status: string;
  readonly manualReviewRecommended: boolean;
}>;

export const calculate = (input: Input): Output => {
  const status = input.publicNoticeRemoved
    ? "released-or-withdrawn"
    : input.liabilitySatisfied || input.collectionPeriodExpired
      ? "release-eligible"
      : "active";
  return { status, manualReviewRecommended: status !== "active" };
};

export const exampleInput = {
  liabilitySatisfied: true,
  collectionPeriodExpired: false,
  publicNoticeRemoved: false,
} satisfies Input;
export const exampleOutput = {
  status: "release-eligible",
  manualReviewRecommended: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      liabilitySatisfied: input.liabilitySatisfied as boolean,
      collectionPeriodExpired: input.collectionPeriodExpired as boolean,
      publicNoticeRemoved: input.publicNoticeRemoved as boolean,
    }),
  description:
    "Classify supplied lien facts without determining legal release or withdrawal eligibility.",
  id: "taxation/lien-status-classifier",
  inputs: [
    {
      id: "liabilitySatisfied",
      label: "Underlying liability satisfied",
      kind: "boolean",
    },
    {
      id: "collectionPeriodExpired",
      label: "Collection period expired",
      kind: "boolean",
    },
    {
      id: "publicNoticeRemoved",
      label: "Public notice removed",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "status",
      label: "Lien status",
      kind: "string",
      enum: ["active", "release-eligible", "released-or-withdrawn"],
    },
    {
      id: "manualReviewRecommended",
      label: "Manual review recommended",
      kind: "boolean",
    },
  ],
  title: "Lien Status Classifier",
});

export const run = tool.execute;
export default tool;
