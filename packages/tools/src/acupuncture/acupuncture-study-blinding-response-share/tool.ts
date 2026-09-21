import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activeGuesses: number;
  readonly shamGuesses: number;
  readonly unknownGuesses: number;
  readonly actualActive: boolean;
  readonly includeUnknown: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly correctGuesses: number;
  readonly correctShare: number;
  readonly unknownShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeGuesses: { type: "integer", minimum: 0 },
    shamGuesses: { type: "integer", minimum: 0 },
    unknownGuesses: { type: "integer", minimum: 0 },
    actualActive: { type: "boolean" },
    includeUnknown: { type: "boolean" },
  },
  required: [
    "activeGuesses",
    "shamGuesses",
    "unknownGuesses",
    "actualActive",
    "includeUnknown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    correctGuesses: { type: "integer" },
    correctShare: { type: "number" },
    unknownShare: { type: "number" },
  },
  required: ["denominator", "correctGuesses", "correctShare", "unknownShare"],
} as const;
/** Calculate acupuncture study blinding response share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    activeGuesses,
    shamGuesses,
    unknownGuesses,
    actualActive,
    includeUnknown,
  } = request;
  const compute = (): Output => {
    H.integer(activeGuesses, 0);
    H.integer(shamGuesses, 0);
    H.integer(unknownGuesses, 0);
    H.domain(activeGuesses + shamGuesses > 0);
    return {
      denominator:
        activeGuesses + shamGuesses + (includeUnknown ? unknownGuesses : 0),
      correctGuesses: actualActive ? activeGuesses : shamGuesses,
      correctShare:
        (actualActive ? activeGuesses : shamGuesses) /
        (activeGuesses + shamGuesses + (includeUnknown ? unknownGuesses : 0)),
      unknownShare:
        unknownGuesses / (activeGuesses + shamGuesses + unknownGuesses),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activeGuesses: 20,
    shamGuesses: 10,
    unknownGuesses: 10,
    actualActive: true,
    includeUnknown: false,
  },
  output: {
    denominator: 30,
    correctGuesses: 20,
    correctShare: 0.6666666666666666,
    unknownShare: 0.25,
  },
} satisfies ToolExample<Input, Output>;
export const acupunctureStudyBlindingResponseShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "acupuncture/acupuncture-study-blinding-response-share",
      title: "Acupuncture Study Blinding Response Share Tool",
      description:
        "Calculate acupuncture study blinding response share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activeGuesses: { type: "integer", minimum: 0 },
          shamGuesses: { type: "integer", minimum: 0 },
          unknownGuesses: { type: "integer", minimum: 0 },
          actualActive: { type: "boolean" },
          includeUnknown: { type: "boolean" },
        },
        required: [
          "activeGuesses",
          "shamGuesses",
          "unknownGuesses",
          "actualActive",
          "includeUnknown",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          correctGuesses: { type: "integer" },
          correctShare: { type: "number" },
          unknownShare: { type: "number" },
        },
        required: [
          "denominator",
          "correctGuesses",
          "correctShare",
          "unknownShare",
        ],
      },
      ports: {
        inputs: [
          {
            id: "activeGuesses",
            label: "Active Guesses",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "shamGuesses",
            label: "Sham Guesses",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unknownGuesses",
            label: "Unknown Guesses",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "actualActive",
            label: "Actual Active",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "includeUnknown",
            label: "Include Unknown",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          {
            id: "correctGuesses",
            label: "Correct Guesses",
            valueType: { type: "integer" },
          },
          {
            id: "correctShare",
            label: "Correct Share",
            valueType: { type: "number" },
          },
          {
            id: "unknownShare",
            label: "Unknown Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = acupunctureStudyBlindingResponseShareTool.execute;
export default acupunctureStudyBlindingResponseShareTool;
