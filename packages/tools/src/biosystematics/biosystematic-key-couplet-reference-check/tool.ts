import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coupletIds: readonly string[];
  readonly targetIds: readonly string[];
  readonly terminal: readonly boolean[];
};
export type Output = {
  readonly missingTargets: readonly string[];
  readonly selfLoops: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coupletIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    targetIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    terminal: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["coupletIds", "targetIds", "terminal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingTargets: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    selfLoops: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["missingTargets", "selfLoops"],
} as const;
/** Audit explicit key-couplet references and terminal flags without identifying a taxon. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coupletIds, targetIds, terminal } = request;
  const compute = (): Output => {
    H.sameLength(coupletIds, targetIds);
    H.sameLength(coupletIds, terminal);
    return {
      missingTargets: [
        ...new Set(
          targetIds.filter((x, i) => !terminal[i] && !coupletIds.includes(x)),
        ),
      ],
      selfLoops: coupletIds.flatMap((x, i) =>
        !terminal[i] && targetIds[i] === x ? [i] : [],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    coupletIds: ["1a", "1b", "2a"],
    targetIds: ["2a", "taxon-A", "3a"],
    terminal: [false, true, false],
  },
  output: { missingTargets: ["3a"], selfLoops: [] },
} satisfies ToolExample<Input, Output>;
export const biosystematicKeyCoupletReferenceCheckTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosystematics/biosystematic-key-couplet-reference-check",
      title: "Biosystematic Key Couplet Reference Check Tool",
      description:
        "Audit explicit key-couplet references and terminal flags without identifying a taxon.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coupletIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          targetIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          terminal: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
        },
        required: ["coupletIds", "targetIds", "terminal"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          missingTargets: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          selfLoops: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["missingTargets", "selfLoops"],
      },
      ports: {
        inputs: [
          {
            id: "coupletIds",
            label: "Couplet Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "targetIds",
            label: "Target Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "terminal",
            label: "Terminal",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
        outputs: [
          {
            id: "missingTargets",
            label: "Missing Targets",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "selfLoops",
            label: "Self Loops",
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosystematicKeyCoupletReferenceCheckTool.execute;
export default biosystematicKeyCoupletReferenceCheckTool;
