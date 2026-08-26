import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OmranEpidemiologicTransitionClassifierInput = {
  readonly lifeExpectancyYears: number;
  readonly framework?: "omran-three-stage" | "olshansky-ault-four-stage";
};

export type OmranEpidemiologicTransitionClassifierOutput = {
  readonly stage:
    | "age-of-pestilence-and-famine"
    | "age-of-receding-pandemics"
    | "age-of-degenerative-and-man-made-diseases"
    | "age-of-delayed-degenerative-diseases";
};

export const calculateOmranEpidemiologicTransitionClassifier = (
  input: OmranEpidemiologicTransitionClassifierInput,
): OmranEpidemiologicTransitionClassifierOutput => {
  if (!(input.lifeExpectancyYears > 0))
    return simpleError(
      "lifeExpectancyYears",
      "Life expectancy at birth must be greater than zero.",
      "invalid_life_expectancy",
    );
  const framework = input.framework ?? "olshansky-ault-four-stage";
  const stage =
    input.lifeExpectancyYears < 40
      ? "age-of-pestilence-and-famine"
      : input.lifeExpectancyYears < 50
        ? "age-of-receding-pandemics"
        : input.lifeExpectancyYears < 75 || framework === "omran-three-stage"
          ? "age-of-degenerative-and-man-made-diseases"
          : "age-of-delayed-degenerative-diseases";
  return { stage };
};

export const omranEpidemiologicTransitionClassifierExample = {
  input: { lifeExpectancyYears: 62, framework: "olshansky-ault-four-stage" },
  output: { stage: "age-of-degenerative-and-man-made-diseases" },
} satisfies ToolExample<
  OmranEpidemiologicTransitionClassifierInput,
  OmranEpidemiologicTransitionClassifierOutput
>;

export const omranEpidemiologicTransitionClassifierTool = createSimpleTool({
  id: "demography/omran-epidemiologic-transition-classifier",
  title: "Omran Epidemiologic Transition Classifier",
  description:
    "Assign the epidemiologic transition stage from life expectancy at birth under the stated band rule (under 40 pestilence and famine, under 50 receding pandemics, otherwise degenerative and man-made diseases, with 75 or over split into Olshansky-Ault delayed degenerative diseases only in the four-stage framework).",
  inputs: [
    {
      description: "Life expectancy at birth in years.",
      id: "lifeExpectancyYears",
      kind: "number",
      label: "e0",
      minimum: 0,
    },
    {
      default: "olshansky-ault-four-stage",
      description:
        "Three-stage Omran model or four-stage model with the Olshansky-Ault fourth age.",
      enum: ["omran-three-stage", "olshansky-ault-four-stage"],
      id: "framework",
      kind: "string",
      label: "Framework",
    },
  ],
  outputs: [
    {
      description: "Epidemiologic transition stage.",
      enum: [
        "age-of-pestilence-and-famine",
        "age-of-receding-pandemics",
        "age-of-degenerative-and-man-made-diseases",
        "age-of-delayed-degenerative-diseases",
      ],
      id: "stage",
      kind: "string",
      label: "Stage",
    },
  ],
  calculate: (input) =>
    calculateOmranEpidemiologicTransitionClassifier(
      input as unknown as OmranEpidemiologicTransitionClassifierInput,
    ),
});

export const runOmranEpidemiologicTransitionClassifier =
  omranEpidemiologicTransitionClassifierTool.execute;
export default omranEpidemiologicTransitionClassifierTool;
