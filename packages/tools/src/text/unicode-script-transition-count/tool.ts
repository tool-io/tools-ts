import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scriptLabels: readonly string[];
  readonly ignoredLabels: readonly string[];
};
export type Output = {
  readonly transitions: number;
  readonly retainedLabels: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scriptLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    ignoredLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["scriptLabels", "ignoredLabels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transitions: { type: "integer" },
    retainedLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["transitions", "retainedLabels"],
} as const;
/** Count transitions in supplied Unicode script annotations after explicit ignored-label removal; does not infer scripts from text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scriptLabels, ignoredLabels } = request;
  const compute = (): Output => {
    const retainedLabels = scriptLabels.filter(
      (x) => !ignoredLabels.includes(x),
    );
    return {
      transitions: retainedLabels
        .slice(1)
        .filter((x, i) => x !== retainedLabels[i]).length,
      retainedLabels,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scriptLabels: ["Latin", "Common", "Greek", "Greek", "Latin"],
    ignoredLabels: ["Common"],
  },
  output: {
    transitions: 2,
    retainedLabels: ["Latin", "Greek", "Greek", "Latin"],
  },
} satisfies ToolExample<Input, Output>;
export const unicodeScriptTransitionCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/unicode-script-transition-count",
    title: "Unicode Script Transition Count Tool",
    description:
      "Count transitions in supplied Unicode script annotations after explicit ignored-label removal; does not infer scripts from text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scriptLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        ignoredLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["scriptLabels", "ignoredLabels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transitions: { type: "integer" },
        retainedLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["transitions", "retainedLabels"],
    },
    ports: {
      inputs: [
        {
          id: "scriptLabels",
          label: "Script Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "ignoredLabels",
          label: "Ignored Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "transitions",
          label: "Transitions",
          valueType: { type: "integer" },
        },
        {
          id: "retainedLabels",
          label: "Retained Labels",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = unicodeScriptTransitionCountTool.execute;
export default unicodeScriptTransitionCountTool;
