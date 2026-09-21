import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceKeys: readonly string[];
  readonly targetKeys: readonly string[];
  readonly requiredTargetCount: number;
};
export type Output = {
  readonly ambiguousTargets: number;
  readonly distinctTargets: number;
  readonly targetCountGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceKeys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    targetKeys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredTargetCount: { type: "integer", minimum: 0 },
  },
  required: ["sourceKeys", "targetKeys", "requiredTargetCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ambiguousTargets: { type: "integer" },
    distinctTargets: { type: "integer" },
    targetCountGap: { type: "integer" },
  },
  required: ["ambiguousTargets", "distinctTargets", "targetCountGap"],
} as const;
/** Calculate form source key ambiguity gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceKeys, targetKeys, requiredTargetCount } = request;
  const compute = (): Output => {
    H.sameLength(sourceKeys, targetKeys);
    H.integer(requiredTargetCount, 0);
    return (() => {
      const groups = new Map<string, Set<string>>();
      sourceKeys.forEach((x, i) => {
        const s = groups.get(targetKeys[i]) ?? new Set<string>();
        s.add(x);
        groups.set(targetKeys[i], s);
      });
      return {
        ambiguousTargets: [...groups.values()].filter((x) => x.size > 1).length,
        distinctTargets: groups.size,
        targetCountGap: groups.size - requiredTargetCount,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceKeys: ["a", "b", "c"],
    targetKeys: ["X", "X", "Y"],
    requiredTargetCount: 3,
  },
  output: { ambiguousTargets: 1, distinctTargets: 2, targetCountGap: -1 },
} satisfies ToolExample<Input, Output>;
export const formSourceKeyAmbiguityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "administrative-science/form-source-key-ambiguity-gap",
    title: "Form Source Key Ambiguity Gap Tool",
    description:
      "Calculate form source key ambiguity gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceKeys: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        targetKeys: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredTargetCount: { type: "integer", minimum: 0 },
      },
      required: ["sourceKeys", "targetKeys", "requiredTargetCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ambiguousTargets: { type: "integer" },
        distinctTargets: { type: "integer" },
        targetCountGap: { type: "integer" },
      },
      required: ["ambiguousTargets", "distinctTargets", "targetCountGap"],
    },
    ports: {
      inputs: [
        {
          id: "sourceKeys",
          label: "Source Keys",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "targetKeys",
          label: "Target Keys",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requiredTargetCount",
          label: "Required Target Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "ambiguousTargets",
          label: "Ambiguous Targets",
          valueType: { type: "integer" },
        },
        {
          id: "distinctTargets",
          label: "Distinct Targets",
          valueType: { type: "integer" },
        },
        {
          id: "targetCountGap",
          label: "Target Count Gap",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = formSourceKeyAmbiguityGapTool.execute;
export default formSourceKeyAmbiguityGapTool;
