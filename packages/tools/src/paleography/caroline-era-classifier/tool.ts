import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CarolineEraClassifierInput = {
  readonly century: number;
};

export type CarolineEraClassifierOutput = {
  readonly eraBand:
    | "pre_caroline"
    | "emergent_reform"
    | "classic_floruit"
    | "transitional_to_gothic"
    | "post_caroline";
  readonly classicFloruitCentury: boolean;
};

export const calculateCarolineEraClassifier = (
  input: CarolineEraClassifierInput,
): CarolineEraClassifierOutput => {
  if (!(
    Number.isSafeInteger(input.century) &&
    input.century >= 1 &&
    input.century <= 20
  ))
    return simpleError(
      "century",
      "Century must be a positive integer.",
      "invalid_century",
    );
  const century = input.century;
  const eraBand =
    century <= 7
      ? "pre_caroline"
      : century === 8
        ? "emergent_reform"
        : century <= 11
          ? "classic_floruit"
          : century === 12
            ? "transitional_to_gothic"
            : "post_caroline";
  return {
    eraBand,
    classicFloruitCentury: century >= 9 && century <= 11,
  };
};

export const carolineEraClassifierExample = {
  input: { century: 10 },
  output: { eraBand: "classic_floruit", classicFloruitCentury: true },
} satisfies ToolExample<
  CarolineEraClassifierInput,
  CarolineEraClassifierOutput
>;

export const carolineEraClassifierTool = createSimpleTool({
  id: "paleography/caroline-era-classifier",
  title: "Caroline Minuscule Era Classifier",
  description:
    "Place a century on the documented Caroline minuscule band table: before the reform (to 7th c.), emergent reform (8th c., Alcuin from about 780), classic floruit (9th-11th), transitional to Gothic (12th) or post-Caroline (13th onward).",
  inputs: [
    {
      description: "Century number, e.g. 9 for the ninth century.",
      id: "century",
      kind: "integer",
      label: "Century",
      maximum: 20,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Caroline usage band for the given century.",
      id: "eraBand",
      enum: [
        "pre_caroline",
        "emergent_reform",
        "classic_floruit",
        "transitional_to_gothic",
        "post_caroline",
      ],
      kind: "string",
      label: "Era band",
    },
    {
      description:
        "True when the century falls in the 9th-11th-century floruit.",
      id: "classicFloruitCentury",
      kind: "boolean",
      label: "Classic floruit",
    },
  ],
  calculate: (input) =>
    calculateCarolineEraClassifier({ century: input.century as number }),
});

export const runCarolineEraClassifier = carolineEraClassifierTool.execute;
export default carolineEraClassifierTool;
