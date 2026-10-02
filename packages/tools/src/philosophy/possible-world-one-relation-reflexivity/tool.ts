import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly worlds: readonly string[];
  readonly edgeSources: readonly string[];
  readonly edgeTargets: readonly string[];
};
export type Output = {
  readonly missingLoops: readonly string[];
  readonly reflexive: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    worlds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    edgeSources: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    edgeTargets: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["worlds", "edgeSources", "edgeTargets"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingLoops: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    reflexive: { type: "boolean" },
  },
  required: ["missingLoops", "reflexive"],
} as const;
/** Calculate possible world one relation reflexivity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { worlds, edgeSources, edgeTargets } = request;
  const compute = (): Output => {
    H.sameLength(edgeSources, edgeTargets);
    const domain = new Set(worlds);
    H.domain(
      domain.size === worlds.length &&
        edgeSources.every((x) => domain.has(x)) &&
        edgeTargets.every((x) => domain.has(x)),
    );
    const missingLoops = worlds.filter(
      (w) => !edgeSources.some((s, i) => s === w && edgeTargets[i] === w),
    );
    return { missingLoops, reflexive: missingLoops.length === 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    worlds: ["a", "b"],
    edgeSources: ["a", "b"],
    edgeTargets: ["a", "b"],
  },
  output: { missingLoops: [], reflexive: true },
} satisfies ToolExample<Input, Output>;
export const possibleWorldOneRelationReflexivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "philosophy/possible-world-one-relation-reflexivity",
      title: "Possible World One Relation Reflexivity Tool",
      description:
        "Calculate possible world one relation reflexivity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          worlds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          edgeSources: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          edgeTargets: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["worlds", "edgeSources", "edgeTargets"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          missingLoops: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          reflexive: { type: "boolean" },
        },
        required: ["missingLoops", "reflexive"],
      },
      ports: {
        inputs: [
          {
            id: "worlds",
            label: "Worlds",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "edgeSources",
            label: "Edge Sources",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "edgeTargets",
            label: "Edge Targets",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "missingLoops",
            label: "Missing Loops",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "reflexive",
            label: "Reflexive",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = possibleWorldOneRelationReflexivityTool.execute;
export default possibleWorldOneRelationReflexivityTool;
