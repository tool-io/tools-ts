import { createTwoWayClassifier } from "../../core/operational.js";

const operation = createTwoWayClassifier({
  description:
    "Classify caller-observed indicators for property action classifier while preserving mixed and insufficient evidence.",
  example: {
    claimAgainstProperty: true,
    bindingAgainstWorld: true,
    claimAgainstPerson: false,
    personalObligation: false,
  },
  first: { value: "in-rem", label: "In-rem indicators" },
  id: "classics/property-action-classifier",
  indicators: [
    {
      id: "claimAgainstProperty",
      label: "Claim directed at property or status",
      side: "first",
    },
    {
      id: "bindingAgainstWorld",
      label: "Judgment concerns rights against the world",
      side: "first",
    },
    {
      id: "claimAgainstPerson",
      label: "Claim directed at a person",
      side: "second",
    },
    {
      id: "personalObligation",
      label: "Personal obligation alleged",
      side: "second",
    },
  ],
  second: { value: "in-personam", label: "In-personam indicators" },
  title: "Property Action Classifier",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
