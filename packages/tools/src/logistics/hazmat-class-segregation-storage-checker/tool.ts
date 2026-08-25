import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HazmatClassSegregationStorageCheckerInput = {
  readonly hazardClassA:
    | "1"
    | "2.1"
    | "3"
    | "4.1"
    | "4.2"
    | "4.3"
    | "5.1"
    | "5.2"
    | "6.1"
    | "7"
    | "8"
    | "9";
  readonly hazardClassB:
    | "1"
    | "2.1"
    | "3"
    | "4.1"
    | "4.2"
    | "4.3"
    | "5.1"
    | "5.2"
    | "6.1"
    | "7"
    | "8"
    | "9";
};

export type HazmatClassSegregationStorageCheckerOutput = {
  readonly guidance: string;
  readonly segregationLevel:
    "no_flagged_conflict" | "same_class" | "separated_from";
};

const SEPARATED_PAIRS = new Set([
  "3|5.1",
  "4.1|5.1",
  "4.2|5.1",
  "4.3|5.1",
  "4.3|8",
]);
const HAZARD_CLASSES = new Set([
  "1",
  "2.1",
  "3",
  "4.1",
  "4.2",
  "4.3",
  "5.1",
  "5.2",
  "6.1",
  "7",
  "8",
  "9",
]);

const GUIDANCE: Record<
  HazmatClassSegregationStorageCheckerOutput["segregationLevel"],
  string
> = {
  no_flagged_conflict:
    "No conflict flagged by this simplified matrix; still consult the full IMDG segregation table before stowage.",
  same_class:
    "Same UN class: apply within-class compatibility checks and any special provisions.",
  separated_from:
    "Potential class-level incompatibility flagged; consult the current IMDG segregation table, Dangerous Goods List entries, subsidiary risks, and special provisions before stowage.",
};

export const calculateHazmatClassSegregationStorageChecker = (
  input: HazmatClassSegregationStorageCheckerInput,
): HazmatClassSegregationStorageCheckerOutput => {
  if (!HAZARD_CLASSES.has(input.hazardClassA))
    return simpleError(
      "hazardClassA",
      "Hazard class A is not supported by this screening matrix.",
      "invalid_class",
    );
  if (!HAZARD_CLASSES.has(input.hazardClassB))
    return simpleError(
      "hazardClassB",
      "Hazard class B is not supported by this screening matrix.",
      "invalid_class",
    );
  const pairKey = [input.hazardClassA, input.hazardClassB].sort().join("|");
  const level: HazmatClassSegregationStorageCheckerOutput["segregationLevel"] =
    input.hazardClassA === input.hazardClassB
      ? "same_class"
      : SEPARATED_PAIRS.has(pairKey)
        ? "separated_from"
        : "no_flagged_conflict";
  return { guidance: GUIDANCE[level], segregationLevel: level };
};

export const hazmatClassSegregationStorageCheckerExample = {
  input: { hazardClassA: "5.1", hazardClassB: "3" },
  output: {
    guidance: GUIDANCE.separated_from,
    segregationLevel: "separated_from",
  },
} satisfies ToolExample<
  HazmatClassSegregationStorageCheckerInput,
  HazmatClassSegregationStorageCheckerOutput
>;

export const hazmatClassSegregationStorageCheckerTool = createSimpleTool({
  id: "logistics/hazmat-class-segregation-storage-checker",
  title: "Hazmat Class Segregation Storage Checker",
  description:
    "Flag storage segregation for two dangerous-goods classes using a simplified heuristic matrix of frequently cited IMDG incompatibilities (oxidizers against flammables and water-reactives; water-reactives against corrosives); it is not a substitute for the full IMDG segregation table.",
  inputs: [
    {
      description: "First dangerous-goods class.",
      enum: [
        "1",
        "2.1",
        "3",
        "4.1",
        "4.2",
        "4.3",
        "5.1",
        "5.2",
        "6.1",
        "7",
        "8",
        "9",
      ],
      id: "hazardClassA",
      kind: "string",
      label: "Class A",
    },
    {
      description: "Second dangerous-goods class.",
      enum: [
        "1",
        "2.1",
        "3",
        "4.1",
        "4.2",
        "4.3",
        "5.1",
        "5.2",
        "6.1",
        "7",
        "8",
        "9",
      ],
      id: "hazardClassB",
      kind: "string",
      label: "Class B",
    },
  ],
  outputs: [
    {
      description: "Plain-language stowage advice for the pair.",
      id: "guidance",
      kind: "string",
      label: "Guidance",
    },
    {
      description: "Segregation verdict for the class pair.",
      enum: ["separated_from", "same_class", "no_flagged_conflict"],
      id: "segregationLevel",
      kind: "string",
      label: "Segregation",
    },
  ],
  calculate: (input) =>
    calculateHazmatClassSegregationStorageChecker({
      hazardClassA:
        input.hazardClassA as HazmatClassSegregationStorageCheckerInput["hazardClassA"],
      hazardClassB:
        input.hazardClassB as HazmatClassSegregationStorageCheckerInput["hazardClassB"],
    }),
});

export const runHazmatClassSegregationStorageChecker =
  hazmatClassSegregationStorageCheckerTool.execute;
export default hazmatClassSegregationStorageCheckerTool;
