import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentIds: readonly string[];
  readonly childIds: readonly string[];
  readonly concept: string;
};
export type Output = {
  readonly ancestorCount: number;
  readonly maximumDepth: number;
  readonly cyclic: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    childIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    concept: { type: "string", maxLength: 8192 },
  },
  required: ["parentIds", "childIds", "concept"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ancestorCount: { type: "integer" },
    maximumDepth: { type: "integer" },
    cyclic: { type: "boolean" },
  },
  required: ["ancestorCount", "maximumDepth", "cyclic"],
} as const;
/** Inspect a supplied vocabulary parent graph, preserving polyhierarchy and explicitly flagging cycles. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentIds, childIds, concept } = request;
  const compute = (): Output => {
    H.sameLength(parentIds, childIds);
    return (() => {
      const parents = new Map<string, Set<string>>();
      childIds.forEach((x, i) => {
        const s = parents.get(x) ?? new Set<string>();
        s.add(parentIds[i]);
        parents.set(x, s);
      });
      const ancestors = new Set<string>(),
        active = new Set<string>(),
        memo = new Map<string, number>();
      let cyclic = false;
      const visit = (id: string): number => {
        if (active.has(id)) {
          cyclic = true;
          return 0;
        }
        const cached = memo.get(id);
        if (cached !== undefined) return cached;
        active.add(id);
        let d = 0;
        for (const p of parents.get(id) ?? []) {
          ancestors.add(p);
          d = Math.max(d, 1 + visit(p));
        }
        active.delete(id);
        memo.set(id, d);
        return d;
      };
      const d = visit(concept);
      ancestors.delete(concept);
      return {
        ancestorCount: ancestors.size,
        maximumDepth: cyclic ? -1 : d,
        cyclic,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parentIds: ["A", "B"], childIds: ["B", "C"], concept: "C" },
  output: { ancestorCount: 2, maximumDepth: 2, cyclic: false },
} satisfies ToolExample<Input, Output>;
export const vocabularyConceptBranchDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/vocabulary-concept-branch-depth",
    title: "Vocabulary Concept Branch Depth Tool",
    description:
      "Inspect a supplied vocabulary parent graph, preserving polyhierarchy and explicitly flagging cycles.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        childIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        concept: { type: "string", maxLength: 8192 },
      },
      required: ["parentIds", "childIds", "concept"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ancestorCount: { type: "integer" },
        maximumDepth: { type: "integer" },
        cyclic: { type: "boolean" },
      },
      required: ["ancestorCount", "maximumDepth", "cyclic"],
    },
    ports: {
      inputs: [
        {
          id: "parentIds",
          label: "Parent Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "childIds",
          label: "Child Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "concept",
          label: "Concept",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "ancestorCount",
          label: "Ancestor Count",
          valueType: { type: "integer" },
        },
        {
          id: "maximumDepth",
          label: "Maximum Depth",
          valueType: { type: "integer" },
        },
        { id: "cyclic", label: "Cyclic", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = vocabularyConceptBranchDepthTool.execute;
export default vocabularyConceptBranchDepthTool;
