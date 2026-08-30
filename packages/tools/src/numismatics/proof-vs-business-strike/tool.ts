import { createTwoWayClassifier } from "../../core/operational.js";

const operation = createTwoWayClassifier({
  description:
    "Classify caller-observed indicators for proof vs. business strike while preserving mixed and insufficient evidence.",
  example: {
    documentedProofIssue: true,
    squaredRims: true,
    ordinaryProductionIssue: false,
    singleStrikeTexture: false,
  },
  first: { value: "proof-strike", label: "Proof indicators" },
  id: "numismatics/proof-vs-business-strike",
  indicators: [
    {
      id: "documentedProofIssue",
      label: "Documented proof issue",
      side: "first",
    },
    { id: "squaredRims", label: "Squared rims", side: "first" },
    {
      id: "ordinaryProductionIssue",
      label: "Ordinary production issue",
      side: "second",
    },
    {
      id: "singleStrikeTexture",
      label: "Ordinary strike texture",
      side: "second",
    },
  ],
  second: { value: "business-strike", label: "Business-strike indicators" },
  title: "Proof vs. Business Strike",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
