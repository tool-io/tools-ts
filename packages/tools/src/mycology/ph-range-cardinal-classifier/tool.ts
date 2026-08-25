import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const phPreferenceClassifierExample = {
  input: {
    acidophilicMaximumPh: 4,
    acidotolerantMaximumPh: 6,
    neutrophilicMaximumPh: 8,
    optimalPh: 7,
  },
  output: { phPreferenceClass: "neutrophilic" },
} satisfies ToolExample<
  {
    readonly acidophilicMaximumPh: number;
    readonly acidotolerantMaximumPh: number;
    readonly neutrophilicMaximumPh: number;
    readonly optimalPh: number;
  },
  { readonly phPreferenceClass: string }
>;

export const phPreferenceClassifierTool = createSimpleTool({
  id: "mycology/ph-range-cardinal-classifier",
  title: "pH Preference Classifier",
  description:
    "Classify an observed optimum growth pH using caller-supplied boundaries; ecological pH preference labels do not have universal numeric cutoffs.",
  inputs: [
    {
      id: "optimalPh",
      kind: "number",
      label: "Optimal pH",
      maximum: 14,
      minimum: 0,
    },
    {
      id: "acidophilicMaximumPh",
      kind: "number",
      label: "Acidophilic maximum",
      maximum: 14,
      minimum: 0,
    },
    {
      id: "acidotolerantMaximumPh",
      kind: "number",
      label: "Acidotolerant maximum",
      maximum: 14,
      minimum: 0,
    },
    {
      id: "neutrophilicMaximumPh",
      kind: "number",
      label: "Neutrophilic maximum",
      maximum: 14,
      minimum: 0,
    },
  ],
  outputs: [
    {
      enum: ["acidophilic", "acidotolerant", "neutrophilic", "alkaliphilic"],
      id: "phPreferenceClass",
      kind: "string",
      label: "pH preference class",
    },
  ],
  calculate: (input) => {
    const optimalPh = input.optimalPh as number;
    const acidophilicMaximumPh = input.acidophilicMaximumPh as number;
    const acidotolerantMaximumPh = input.acidotolerantMaximumPh as number;
    const neutrophilicMaximumPh = input.neutrophilicMaximumPh as number;
    if (!(
      acidophilicMaximumPh < acidotolerantMaximumPh &&
      acidotolerantMaximumPh < neutrophilicMaximumPh
    ))
      simpleError(
        "neutrophilicMaximumPh",
        "Preference boundaries must increase from acidophilic through neutrophilic.",
      );
    const phPreferenceClass =
      optimalPh <= acidophilicMaximumPh
        ? "acidophilic"
        : optimalPh <= acidotolerantMaximumPh
          ? "acidotolerant"
          : optimalPh <= neutrophilicMaximumPh
            ? "neutrophilic"
            : "alkaliphilic";
    return { phPreferenceClass };
  },
});
export const runPhPreferenceClassifier = phPreferenceClassifierTool.execute;
export default phPreferenceClassifierTool;
