import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedSide: string;
  readonly expectedSide: string;
  readonly suppliedLeftToken: string;
  readonly suppliedRightToken: string;
};
export type Output = {
  readonly recordedKnown: boolean;
  readonly referenceKnown: boolean;
  readonly matches: boolean;
  readonly opposite: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedSide: { type: "string", maxLength: 8192 },
    expectedSide: { type: "string", maxLength: 8192 },
    suppliedLeftToken: { type: "string", maxLength: 8192 },
    suppliedRightToken: { type: "string", maxLength: 8192 },
  },
  required: [
    "recordedSide",
    "expectedSide",
    "suppliedLeftToken",
    "suppliedRightToken",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedKnown: { type: "boolean" },
    referenceKnown: { type: "boolean" },
    matches: { type: "boolean" },
    opposite: { type: "boolean" },
  },
  required: ["recordedKnown", "referenceKnown", "matches", "opposite"],
} as const;
/** Compare explicit research laterality labels under a supplied two-side vocabulary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedSide, expectedSide, suppliedLeftToken, suppliedRightToken } =
    request;
  const compute = (): Output => {
    return (() => {
      H.domain(suppliedLeftToken !== suppliedRightToken);
      const a = [suppliedLeftToken, suppliedRightToken].includes(recordedSide),
        b = [suppliedLeftToken, suppliedRightToken].includes(expectedSide);
      return {
        recordedKnown: a,
        referenceKnown: b,
        matches: a && b && recordedSide === expectedSide,
        opposite: a && b && recordedSide !== expectedSide,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedSide: "L",
    expectedSide: "R",
    suppliedLeftToken: "L",
    suppliedRightToken: "R",
  },
  output: {
    recordedKnown: true,
    referenceKnown: true,
    matches: false,
    opposite: true,
  },
} satisfies ToolExample<Input, Output>;
export const earSideReferenceGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "otolaryngology/ear-side-reference-gap",
      title: "Ear Side Reference Gap Tool",
      description:
        "Compare explicit research laterality labels under a supplied two-side vocabulary.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedSide: { type: "string", maxLength: 8192 },
          expectedSide: { type: "string", maxLength: 8192 },
          suppliedLeftToken: { type: "string", maxLength: 8192 },
          suppliedRightToken: { type: "string", maxLength: 8192 },
        },
        required: [
          "recordedSide",
          "expectedSide",
          "suppliedLeftToken",
          "suppliedRightToken",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedKnown: { type: "boolean" },
          referenceKnown: { type: "boolean" },
          matches: { type: "boolean" },
          opposite: { type: "boolean" },
        },
        required: ["recordedKnown", "referenceKnown", "matches", "opposite"],
      },
      ports: {
        inputs: [
          {
            id: "recordedSide",
            label: "Recorded Side",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expectedSide",
            label: "Expected Side",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedLeftToken",
            label: "Supplied Left Token",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedRightToken",
            label: "Supplied Right Token",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "recordedKnown",
            label: "Recorded Known",
            valueType: { type: "boolean" },
          },
          {
            id: "referenceKnown",
            label: "Reference Known",
            valueType: { type: "boolean" },
          },
          { id: "matches", label: "Matches", valueType: { type: "boolean" } },
          { id: "opposite", label: "Opposite", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  },
);
export const run = earSideReferenceGapTool.execute;
export default earSideReferenceGapTool;
