import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

type HairPerforationObservation = "absent" | "present";

export const hairPerforationClassifierExample = {
  input: { perforationsObserved: "present" },
  output: { perforationClass: "positive-perforation" },
} satisfies ToolExample<
  { readonly perforationsObserved: HairPerforationObservation },
  {
    readonly perforationClass: "negative-perforation" | "positive-perforation";
  }
>;

export const hairPerforationClassifierTool = createSimpleTool({
  id: "mycology/hair-perforation-test-classifier",
  title: "Hair Perforation Classifier",
  description:
    "Classify an in vitro hair perforation test observation as positive or negative perforation.",
  inputs: [
    {
      enum: ["present", "absent"],
      id: "perforationsObserved",
      kind: "string",
      label: "Perforations observed",
    },
  ],
  outputs: [
    {
      enum: ["positive-perforation", "negative-perforation"],
      id: "perforationClass",
      kind: "string",
      label: "Perforation class",
    },
  ],
  calculate: (input) => ({
    perforationClass:
      input.perforationsObserved === "present"
        ? "positive-perforation"
        : "negative-perforation",
  }),
});
export const runHairPerforationClassifier =
  hairPerforationClassifierTool.execute;
export default hairPerforationClassifierTool;
