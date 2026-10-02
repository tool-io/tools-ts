import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly siteWeights: readonly number[];
  readonly sourceKnown: readonly boolean[];
  readonly editionMatched: readonly boolean[];
  readonly siteApplicable: readonly boolean[];
};
export type Output = {
  readonly applicableWeight: number;
  readonly supportedWeight: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    siteWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    sourceKnown: { type: "array", maxItems: 256, items: { type: "boolean" } },
    editionMatched: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    siteApplicable: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["siteWeights", "sourceKnown", "editionMatched", "siteApplicable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    applicableWeight: { type: "number" },
    supportedWeight: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["applicableWeight", "supportedWeight", "share", "defined"],
} as const;
/** Calculate periodontal source support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { siteWeights, sourceKnown, editionMatched, siteApplicable } = request;
  const compute = (): Output => {
    H.sameLength(siteWeights, sourceKnown);
    H.sameLength(siteWeights, editionMatched);
    H.sameLength(siteWeights, siteApplicable);
    H.domain(siteWeights.every((x) => x >= 0));
    return (() => {
      const applicableWeight = siteWeights.reduce(
          (s, x, i) => s + (siteApplicable[i] ? x : 0),
          0,
        ),
        supportedWeight = siteWeights.reduce(
          (s, x, i) =>
            s +
            (siteApplicable[i] && sourceKnown[i] && editionMatched[i] ? x : 0),
          0,
        );
      return {
        applicableWeight,
        supportedWeight,
        share: applicableWeight > 0 ? supportedWeight / applicableWeight : 0,
        defined: applicableWeight > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    siteWeights: [2, 3, 5],
    sourceKnown: [true, true, true],
    editionMatched: [true, false, true],
    siteApplicable: [true, true, false],
  },
  output: {
    applicableWeight: 5,
    supportedWeight: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const periodontalSourceSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "periodontology/periodontal-source-support-share",
    title: "Periodontal Source Support Share Tool",
    description:
      "Calculate periodontal source support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        siteWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        sourceKnown: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        editionMatched: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        siteApplicable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "siteWeights",
        "sourceKnown",
        "editionMatched",
        "siteApplicable",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        applicableWeight: { type: "number" },
        supportedWeight: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["applicableWeight", "supportedWeight", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "siteWeights",
          label: "Site Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sourceKnown",
          label: "Source Known",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "editionMatched",
          label: "Edition Matched",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "siteApplicable",
          label: "Site Applicable",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "applicableWeight",
          label: "Applicable Weight",
          valueType: { type: "number" },
        },
        {
          id: "supportedWeight",
          label: "Supported Weight",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = periodontalSourceSupportShareTool.execute;
export default periodontalSourceSupportShareTool;
