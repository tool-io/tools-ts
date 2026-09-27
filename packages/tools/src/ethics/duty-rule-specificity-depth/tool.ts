import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scopePath: readonly string[];
  readonly broaderPath: readonly string[];
};
export type Output = {
  readonly depth: number;
  readonly prefixApplies: boolean;
  readonly additionalLevels: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scopePath: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    broaderPath: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["scopePath", "broaderPath"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depth: { type: "integer" },
    prefixApplies: { type: "boolean" },
    additionalLevels: { type: "integer" },
  },
  required: ["depth", "prefixApplies", "additionalLevels"],
} as const;
/** Compare explicit rule-scope paths; path specificity does not establish ethical precedence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scopePath, broaderPath } = request;
  const compute = (): Output => {
    return {
      depth: scopePath.length,
      prefixApplies:
        broaderPath.length <= scopePath.length &&
        broaderPath.every((x, i) => scopePath[i] === x),
      additionalLevels:
        broaderPath.length <= scopePath.length &&
        broaderPath.every((x, i) => scopePath[i] === x)
          ? scopePath.length - broaderPath.length
          : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scopePath: ["A", "B", "C"], broaderPath: ["A"] },
  output: { depth: 3, prefixApplies: true, additionalLevels: 2 },
} satisfies ToolExample<Input, Output>;
export const dutyRuleSpecificityDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/duty-rule-specificity-depth",
    title: "Duty Rule Specificity Depth Tool",
    description:
      "Compare explicit rule-scope paths; path specificity does not establish ethical precedence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scopePath: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        broaderPath: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["scopePath", "broaderPath"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depth: { type: "integer" },
        prefixApplies: { type: "boolean" },
        additionalLevels: { type: "integer" },
      },
      required: ["depth", "prefixApplies", "additionalLevels"],
    },
    ports: {
      inputs: [
        {
          id: "scopePath",
          label: "Scope Path",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "broaderPath",
          label: "Broader Path",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "depth", label: "Depth", valueType: { type: "integer" } },
        {
          id: "prefixApplies",
          label: "Prefix Applies",
          valueType: { type: "boolean" },
        },
        {
          id: "additionalLevels",
          label: "Additional Levels",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = dutyRuleSpecificityDepthTool.execute;
export default dutyRuleSpecificityDepthTool;
