import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KurrentCenturyClassifierInput = {
  readonly century: number;
};

export type KurrentCenturyClassifierOutput = {
  readonly kurrentPhase:
    | "pre_kurrent_cursive_background"
    | "kurrent_emergence"
    | "baroque_kurrent"
    | "nineteenth_century_kurrent"
    | "suetterlin_and_kurrent_end"
    | "digital_era_legacy";
  readonly phaseBounds: string;
};

export const calculateKurrentCenturyClassifier = (
  input: KurrentCenturyClassifierInput,
): KurrentCenturyClassifierOutput => {
  if (!(
    Number.isSafeInteger(input.century) &&
    input.century >= 1 &&
    input.century <= 21
  ))
    return simpleError(
      "century",
      "Century must be an integer from 1 through 21.",
      "invalid_century",
    );
  const century = input.century;
  const kurrentPhase =
    century <= 16
      ? "pre_kurrent_cursive_background"
      : century === 17
        ? "kurrent_emergence"
        : century === 18
          ? "baroque_kurrent"
          : century === 19
            ? "nineteenth_century_kurrent"
            : century === 20
              ? "suetterlin_and_kurrent_end"
              : "digital_era_legacy";
  const PHASE_BOUNDS: Record<
    KurrentCenturyClassifierOutput["kurrentPhase"],
    string
  > = {
    pre_kurrent_cursive_background: "up to 16th c.",
    kurrent_emergence: "17th c.",
    baroque_kurrent: "18th c.",
    nineteenth_century_kurrent: "19th c.",
    suetterlin_and_kurrent_end: "20th c. (Sütterlin from 1911)",
    digital_era_legacy: "21st c. onward",
  };
  return { kurrentPhase, phaseBounds: PHASE_BOUNDS[kurrentPhase] };
};

export const kurrentCenturyClassifierExample = {
  input: { century: 19 },
  output: {
    kurrentPhase: "nineteenth_century_kurrent",
    phaseBounds: "19th c.",
  },
} satisfies ToolExample<
  KurrentCenturyClassifierInput,
  KurrentCenturyClassifierOutput
>;

export const kurrentCenturyClassifierTool = createSimpleTool({
  id: "paleography/kurrent-century-classifier",
  title: "Kurrent Century Classifier",
  description:
    "Classify a century on the documented German Kurrent band table stated plainly: cursive background before the 17th c., emergence (17th), baroque Kurrent (18th), nineteenth-century standard Kurrent (19th), Sütterlin era and end of school-taught Kurrent (20th, script taught from 1911) and digital-era legacy reading (21st onward).",
  inputs: [
    {
      description: "Century number of the document.",
      id: "century",
      kind: "integer",
      label: "Century",
      maximum: 21,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Kurrent phase for the given century.",
      id: "kurrentPhase",
      enum: [
        "pre_kurrent_cursive_background",
        "kurrent_emergence",
        "baroque_kurrent",
        "nineteenth_century_kurrent",
        "suetterlin_and_kurrent_end",
        "digital_era_legacy",
      ],
      kind: "string",
      label: "Kurrent phase",
    },
    {
      description: "Human-readable bounds of the phase as stated.",
      id: "phaseBounds",
      kind: "string",
      label: "Phase bounds",
    },
  ],
  calculate: (input) =>
    calculateKurrentCenturyClassifier({ century: input.century as number }),
});

export const runKurrentCenturyClassifier = kurrentCenturyClassifierTool.execute;
export default kurrentCenturyClassifierTool;
