import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousContext: string;
  readonly currentContext: string;
};
export type Output = { readonly changed: boolean; readonly transition: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousContext: { type: "string", maxLength: 8192, minLength: 1 },
    currentContext: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["previousContext", "currentContext"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    changed: { type: "boolean" },
    transition: { type: "string", maxLength: 8192 },
  },
  required: ["changed", "transition"],
} as const;
/** Compare adjacent explicitly coded behavior contexts and preserve their directed transition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousContext, currentContext } = request;
  const compute = (): Output => {
    H.domain(
      previousContext.length > 0 && currentContext.length > 0,
      "previousContext",
    );
    return {
      changed: previousContext !== currentContext,
      transition: JSON.stringify([previousContext, currentContext]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousContext: "home", currentContext: "work" },
  output: { changed: true, transition: '["home","work"]' },
} satisfies ToolExample<Input, Output>;
export const behaviorContextChangeFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["behavioral-science", "behavioral science", "psychology"],
      keywords: ["behavioral science", "psychology"],
    },
    id: "behavioral-science/behavior-context-change-flag",
    title: "Behavior Context Change Flag",
    description:
      "Compare adjacent explicitly coded behavior contexts and preserve their directed transition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousContext: { type: "string", maxLength: 8192, minLength: 1 },
        currentContext: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["previousContext", "currentContext"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        changed: { type: "boolean" },
        transition: { type: "string", maxLength: 8192 },
      },
      required: ["changed", "transition"],
    },
    ports: {
      inputs: [
        {
          id: "previousContext",
          label: "Previous Context",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currentContext",
          label: "Current Context",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "changed", label: "Changed", valueType: { type: "boolean" } },
        {
          id: "transition",
          label: "Transition",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = behaviorContextChangeFlagTool.execute;
export default behaviorContextChangeFlagTool;
