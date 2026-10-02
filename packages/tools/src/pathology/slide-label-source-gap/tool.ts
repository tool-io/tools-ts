import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slideIds: readonly string[];
  readonly labelSources: readonly string[];
  readonly expectedSources: readonly string[];
};
export type Output = {
  readonly mismatches: number;
  readonly missingSourceLabels: number;
  readonly matched: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slideIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    labelSources: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    expectedSources: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["slideIds", "labelSources", "expectedSources"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mismatches: { type: "integer" },
    missingSourceLabels: { type: "integer" },
    matched: { type: "integer" },
  },
  required: ["mismatches", "missingSourceLabels", "matched"],
} as const;
/** Calculate slide label source gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slideIds, labelSources, expectedSources } = request;
  const compute = (): Output => {
    H.sameLength(slideIds, labelSources);
    H.sameLength(slideIds, expectedSources);
    H.domain(
      new Set(slideIds).size === slideIds.length &&
        expectedSources.every((x) => x.length > 0),
    );
    return {
      mismatches: slideIds.filter(
        (x, i) => labelSources[i] !== expectedSources[i],
      ).length,
      missingSourceLabels: labelSources.filter((x) => x.length === 0).length,
      matched: slideIds.filter((x, i) => labelSources[i] === expectedSources[i])
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    slideIds: ["a", "b"],
    labelSources: ["s1", ""],
    expectedSources: ["s1", "s2"],
  },
  output: { mismatches: 1, missingSourceLabels: 1, matched: 1 },
} satisfies ToolExample<Input, Output>;
export const slideLabelSourceGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "pathology/slide-label-source-gap",
      title: "Slide Label Source Gap Tool",
      description:
        "Calculate slide label source gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          slideIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          labelSources: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          expectedSources: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["slideIds", "labelSources", "expectedSources"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mismatches: { type: "integer" },
          missingSourceLabels: { type: "integer" },
          matched: { type: "integer" },
        },
        required: ["mismatches", "missingSourceLabels", "matched"],
      },
      ports: {
        inputs: [
          {
            id: "slideIds",
            label: "Slide Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "labelSources",
            label: "Label Sources",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "expectedSources",
            label: "Expected Sources",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "mismatches",
            label: "Mismatches",
            valueType: { type: "integer" },
          },
          {
            id: "missingSourceLabels",
            label: "Missing Source Labels",
            valueType: { type: "integer" },
          },
          { id: "matched", label: "Matched", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  },
);
export const run = slideLabelSourceGapTool.execute;
export default slideLabelSourceGapTool;
