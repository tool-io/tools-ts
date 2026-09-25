import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly conditionKeys: readonly string[];
  readonly activeConditions: readonly string[];
};
export type Output = {
  readonly matched: boolean;
  readonly selectedKey: string;
  readonly index: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditionKeys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    activeConditions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["conditionKeys", "activeConditions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matched: { type: "boolean" },
    selectedKey: { type: "string", maxLength: 8192 },
    index: { type: "integer" },
  },
  required: ["matched", "selectedKey", "index"],
} as const;
/** Select the first active conditional-export key in explicit insertion order; no filesystem resolution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { conditionKeys, activeConditions } = request;
  const compute = (): Output => {
    H.domain(new Set(conditionKeys).size === conditionKeys.length);
    const index = conditionKeys.findIndex(
      (x) => x === "default" || activeConditions.includes(x),
    );
    return {
      matched: index >= 0,
      selectedKey: index >= 0 ? conditionKeys[index] : "",
      index,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    conditionKeys: ["import", "node", "default"],
    activeConditions: ["node", "import"],
  },
  output: { matched: true, selectedKey: "import", index: 0 },
} satisfies ToolExample<Input, Output>;
export const packageExportConditionPriorityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/package-export-condition-priority",
    title: "Package Export Condition Priority Tool",
    description:
      "Select the first active conditional-export key in explicit insertion order; no filesystem resolution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conditionKeys: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        activeConditions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["conditionKeys", "activeConditions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matched: { type: "boolean" },
        selectedKey: { type: "string", maxLength: 8192 },
        index: { type: "integer" },
      },
      required: ["matched", "selectedKey", "index"],
    },
    ports: {
      inputs: [
        {
          id: "conditionKeys",
          label: "Condition Keys",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "activeConditions",
          label: "Active Conditions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "matched", label: "Matched", valueType: { type: "boolean" } },
        {
          id: "selectedKey",
          label: "Selected Key",
          valueType: { type: "string" },
        },
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = packageExportConditionPriorityTool.execute;
export default packageExportConditionPriorityTool;
