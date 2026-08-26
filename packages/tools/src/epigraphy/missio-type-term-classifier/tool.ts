import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MissioTypeTermClassifierInput = {
  readonly text: string;
};

export type MissioTypeTermClassifierOutput = {
  readonly classification: "honesta" | "causaria" | "ignominiosa" | "unknown";
  readonly matchedTerm: string;
};

const MISSIO_TERMS: ReadonlyArray<
  readonly ["honesta" | "causaria" | "ignominiosa", string]
> = [
  ["honesta", "honesta"],
  ["causaria", "causaria"],
  ["ignominiosa", "ignominiosa"],
];

export const calculateMissioTypeTermClassifier = (
  input: MissioTypeTermClassifierInput,
): MissioTypeTermClassifierOutput => {
  if (!input.text.trim())
    simpleError("text", "Text must contain characters.", "empty_text");
  const lowered = input.text.toLowerCase();
  let bestIndex = Number.POSITIVE_INFINITY;
  let classification: MissioTypeTermClassifierOutput["classification"] =
    "unknown";
  let matchedTerm = "";
  for (const [label, term] of MISSIO_TERMS) {
    const index = lowered.indexOf(term);
    if (index !== -1 && index < bestIndex) {
      bestIndex = index;
      classification = label;
      matchedTerm = input.text.slice(index, index + term.length);
    }
  }
  return { classification, matchedTerm };
};

export const missioTypeTermClassifierExample = {
  input: { text: "missio causaria ob causas" },
  output: { classification: "causaria", matchedTerm: "causaria" },
} satisfies ToolExample<
  MissioTypeTermClassifierInput,
  MissioTypeTermClassifierOutput
>;

export const missioTypeTermClassifierTool = createSimpleTool({
  id: "epigraphy/missio-type-term-classifier",
  title: "Missio Honesta Discharge Type Term Classifier",
  description:
    "Classifies Roman military discharge wording into honesta, causaria or ignominiosa missio by the earliest matching term.",
  inputs: [
    {
      id: "text",
      kind: "string",
      label: "Text",
      description: "Discharge formula or diploma text.",
    },
  ],
  outputs: [
    {
      id: "classification",
      kind: "string",
      enum: ["honesta", "causaria", "ignominiosa", "unknown"],
      label: "Classification",
      description: "Discharge type category.",
    },
    {
      id: "matchedTerm",
      kind: "string",
      label: "Matched term",
      description: "The discharge term as written, empty when unknown.",
    },
  ],
  calculate: (input) =>
    calculateMissioTypeTermClassifier(
      input as unknown as MissioTypeTermClassifierInput,
    ),
});

export const runMissioTypeTermClassifier = missioTypeTermClassifierTool.execute;
export default missioTypeTermClassifierTool;
