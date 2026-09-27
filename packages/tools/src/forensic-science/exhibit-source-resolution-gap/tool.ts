import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exhibitIds: readonly string[];
  readonly measuredQuanta: readonly number[];
  readonly requiredQuanta: readonly number[];
};
export type Output = {
  readonly coarserExhibits: number;
  readonly largestQuantumRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exhibitIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    measuredQuanta: { type: "array", maxItems: 256, items: { type: "number" } },
    requiredQuanta: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["exhibitIds", "measuredQuanta", "requiredQuanta"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coarserExhibits: { type: "integer" },
    largestQuantumRatio: { type: "number" },
  },
  required: ["coarserExhibits", "largestQuantumRatio"],
} as const;
/** Compare explicit source resolution requirements; no evidentiary reliability conclusion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exhibitIds, measuredQuanta, requiredQuanta } = request;
  const compute = (): Output => {
    H.sameLength(exhibitIds, measuredQuanta);
    H.sameLength(exhibitIds, requiredQuanta);
    H.domain(
      new Set(exhibitIds).size === exhibitIds.length &&
        measuredQuanta.every((x) => x > 0) &&
        requiredQuanta.every((x) => x > 0),
    );
    return (() => {
      const ratios = measuredQuanta.map((x, i) => x / requiredQuanta[i]);
      return {
        coarserExhibits: ratios.filter((x) => x > 1).length,
        largestQuantumRatio: Math.max(0, ...ratios),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    exhibitIds: ["a", "b"],
    measuredQuanta: [1, 3],
    requiredQuanta: [2, 2],
  },
  output: { coarserExhibits: 1, largestQuantumRatio: 1.5 },
} satisfies ToolExample<Input, Output>;
export const exhibitSourceResolutionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/exhibit-source-resolution-gap",
    title: "Exhibit Source Resolution Gap Tool",
    description:
      "Compare explicit source resolution requirements; no evidentiary reliability conclusion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exhibitIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        measuredQuanta: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        requiredQuanta: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["exhibitIds", "measuredQuanta", "requiredQuanta"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coarserExhibits: { type: "integer" },
        largestQuantumRatio: { type: "number" },
      },
      required: ["coarserExhibits", "largestQuantumRatio"],
    },
    ports: {
      inputs: [
        {
          id: "exhibitIds",
          label: "Exhibit Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "measuredQuanta",
          label: "Measured Quanta",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "requiredQuanta",
          label: "Required Quanta",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "coarserExhibits",
          label: "Coarser Exhibits",
          valueType: { type: "integer" },
        },
        {
          id: "largestQuantumRatio",
          label: "Largest Quantum Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exhibitSourceResolutionGapTool.execute;
export default exhibitSourceResolutionGapTool;
