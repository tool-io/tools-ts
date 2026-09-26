import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entityIds: readonly string[];
  readonly periodIds: readonly string[];
  readonly observed: readonly boolean[];
  readonly weights: readonly number[];
};
export type Output = {
  readonly totalWeight: number;
  readonly observedWeight: number;
  readonly missingWeight: number;
  readonly duplicateCells: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entityIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    periodIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    weights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
  },
  required: ["entityIds", "periodIds", "observed", "weights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalWeight: { type: "number" },
    observedWeight: { type: "number" },
    missingWeight: { type: "number" },
    duplicateCells: { type: "integer" },
  },
  required: [
    "totalWeight",
    "observedWeight",
    "missingWeight",
    "duplicateCells",
  ],
} as const;
/** Calculate panel observation weight gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entityIds, periodIds, observed, weights } = request;
  const compute = (): Output => {
    H.sameLength(entityIds, periodIds);
    H.sameLength(entityIds, observed);
    H.sameLength(entityIds, weights);
    H.domain(weights.every((x) => x >= 0));
    return (() => {
      const totalWeight = weights.reduce((a, b) => a + b, 0),
        observedWeight = weights.reduce(
          (s, x, i) => s + (observed[i] ? x : 0),
          0,
        ),
        cells = new Map<string, Set<string>>();
      entityIds.forEach((x, i) => {
        const s = cells.get(x) ?? new Set<string>();
        s.add(periodIds[i]);
        cells.set(x, s);
      });
      return {
        totalWeight,
        observedWeight,
        missingWeight: totalWeight - observedWeight,
        duplicateCells:
          entityIds.length -
          [...cells.values()].reduce((s, x) => s + x.size, 0),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    entityIds: ["a", "a", "b"],
    periodIds: ["1", "1", "1"],
    observed: [true, false, true],
    weights: [2, 3, 4],
  },
  output: {
    totalWeight: 9,
    observedWeight: 6,
    missingWeight: 3,
    duplicateCells: 1,
  },
} satisfies ToolExample<Input, Output>;
export const panelObservationWeightGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/panel-observation-weight-gap",
    title: "Panel Observation Weight Gap Tool",
    description:
      "Calculate panel observation weight gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entityIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        periodIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        weights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
      },
      required: ["entityIds", "periodIds", "observed", "weights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalWeight: { type: "number" },
        observedWeight: { type: "number" },
        missingWeight: { type: "number" },
        duplicateCells: { type: "integer" },
      },
      required: [
        "totalWeight",
        "observedWeight",
        "missingWeight",
        "duplicateCells",
      ],
    },
    ports: {
      inputs: [
        {
          id: "entityIds",
          label: "Entity Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "periodIds",
          label: "Period Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "totalWeight",
          label: "Total Weight",
          valueType: { type: "number" },
        },
        {
          id: "observedWeight",
          label: "Observed Weight",
          valueType: { type: "number" },
        },
        {
          id: "missingWeight",
          label: "Missing Weight",
          valueType: { type: "number" },
        },
        {
          id: "duplicateCells",
          label: "Duplicate Cells",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = panelObservationWeightGapTool.execute;
export default panelObservationWeightGapTool;
