import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleWeights: readonly number[];
  readonly included: readonly boolean[];
  readonly normalizeIncluded: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly includedWeight: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleWeights: { type: "array", maxItems: 256, items: { type: "number" } },
    included: { type: "array", maxItems: 256, items: { type: "boolean" } },
    normalizeIncluded: { type: "boolean" },
  },
  required: ["sampleWeights", "included", "normalizeIncluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "number" },
    includedWeight: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "includedWeight", "share", "defined"],
} as const;
/** Calculate audit sample weight base flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleWeights, included, normalizeIncluded } = request;
  const compute = (): Output => {
    H.sameLength(sampleWeights, included);
    H.domain(sampleWeights.every((x) => x >= 0));
    return {
      denominator: sampleWeights.reduce(
        (a, b, i) => a + (!normalizeIncluded || included[i] ? b : 0),
        0,
      ),
      includedWeight: sampleWeights.reduce(
        (a, b, i) => a + (included[i] ? b : 0),
        0,
      ),
      share:
        sampleWeights.reduce(
          (a, b, i) => a + (!normalizeIncluded || included[i] ? b : 0),
          0,
        ) > 0
          ? sampleWeights.reduce((a, b, i) => a + (included[i] ? b : 0), 0) /
            sampleWeights.reduce(
              (a, b, i) => a + (!normalizeIncluded || included[i] ? b : 0),
              0,
            )
          : 0,
      defined: sampleWeights.some(
        (x, i) => x > 0 && (!normalizeIncluded || included[i]),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleWeights: [2, 3, 5],
    included: [true, false, true],
    normalizeIncluded: false,
  },
  output: { denominator: 10, includedWeight: 7, share: 0.7, defined: true },
} satisfies ToolExample<Input, Output>;
export const auditSampleWeightBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/audit-sample-weight-base-flag",
    title: "Audit Sample Weight Base Flag Tool",
    description:
      "Calculate audit sample weight base flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        included: { type: "array", maxItems: 256, items: { type: "boolean" } },
        normalizeIncluded: { type: "boolean" },
      },
      required: ["sampleWeights", "included", "normalizeIncluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "number" },
        includedWeight: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "includedWeight", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "sampleWeights",
          label: "Sample Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "included",
          label: "Included",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "normalizeIncluded",
          label: "Normalize Included",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
        {
          id: "includedWeight",
          label: "Included Weight",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = auditSampleWeightBaseFlagTool.execute;
export default auditSampleWeightBaseFlagTool;
