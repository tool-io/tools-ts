import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedIndices: readonly number[];
  readonly expectedStep: number;
};
export type Output = { readonly missingBetween: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    expectedStep: { type: "integer", minimum: 1 },
  },
  required: ["observedIndices", "expectedStep"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingBetween: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["missingBetween"],
} as const;
/** Count omitted equally spaced time indices between explicitly increasing panel observations, requiring alignment to a supplied integer step. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedIndices, expectedStep } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(expectedStep) &&
        expectedStep >= 1 &&
        expectedStep <= Number.MAX_SAFE_INTEGER,
      "expectedStep",
    ),
      expectedStep);
    H.domain(
      observedIndices.every(
        (v, i) =>
          Number.isSafeInteger(v) && (i === 0 || v > observedIndices[i - 1]),
      ),
      "observedIndices",
    );
    return {
      missingBetween: observedIndices.slice(1).map((v, i) => {
        const gap = v - observedIndices[i];
        H.domain(
          Number.isSafeInteger(gap) && gap % expectedStep === 0,
          "observedIndices",
        );
        return gap / expectedStep - 1;
      }),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedIndices: [1, 2, 5], expectedStep: 1 },
  output: { missingBetween: [0, 2] },
} satisfies ToolExample<Input, Output>;
export const panelMissingTimeGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["econometrics", "economics"],
        keywords: ["econometrics", "economics"],
      },
      id: "econometrics/panel-missing-time-gap",
      title: "Panel Missing Time Gap",
      description:
        "Count omitted equally spaced time indices between explicitly increasing panel observations, requiring alignment to a supplied integer step.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedIndices: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          expectedStep: { type: "integer", minimum: 1 },
        },
        required: ["observedIndices", "expectedStep"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          missingBetween: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["missingBetween"],
      },
      ports: {
        inputs: [
          {
            id: "observedIndices",
            label: "Observed Indices",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "expectedStep",
            label: "Expected Step",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "missingBetween",
            label: "Missing Between",
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = panelMissingTimeGapTool.execute;
export default panelMissingTimeGapTool;
