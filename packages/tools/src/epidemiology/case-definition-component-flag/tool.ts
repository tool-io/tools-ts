import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly componentSatisfied: readonly boolean[];
  readonly componentKnown: readonly boolean[];
  readonly requireAll: boolean;
};
export type Output = {
  readonly definitionKnown: boolean;
  readonly meetsRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentSatisfied: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    componentKnown: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    requireAll: { type: "boolean" },
  },
  required: ["componentSatisfied", "componentKnown", "requireAll"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    definitionKnown: { type: "boolean" },
    meetsRule: { type: "boolean" },
  },
  required: ["definitionKnown", "meetsRule"],
} as const;
/** Evaluate supplied research classification component flags under explicit all/any logic, preserving unresolved components; no diagnosis or case definition is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { componentSatisfied, componentKnown, requireAll } = request;
  const compute = (): Output => {
    H.sameLength(componentSatisfied, componentKnown);
    H.domain(componentSatisfied.length > 0);
    const knownTrue = componentSatisfied.some((x, i) => componentKnown[i] && x),
      knownFalse = componentSatisfied.some((x, i) => componentKnown[i] && !x),
      allKnown = componentKnown.every(Boolean),
      definitionKnown = requireAll
        ? knownFalse || allKnown
        : knownTrue || allKnown;
    return {
      definitionKnown,
      meetsRule: definitionKnown && (requireAll ? !knownFalse : knownTrue),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    componentSatisfied: [true, false],
    componentKnown: [true, false],
    requireAll: true,
  },
  output: { definitionKnown: false, meetsRule: false },
} satisfies ToolExample<Input, Output>;
export const caseDefinitionComponentFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/case-definition-component-flag",
    title: "Case Definition Component Flag Tool",
    description:
      "Evaluate supplied research classification component flags under explicit all/any logic, preserving unresolved components; no diagnosis or case definition is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        componentSatisfied: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        componentKnown: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        requireAll: { type: "boolean" },
      },
      required: ["componentSatisfied", "componentKnown", "requireAll"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        definitionKnown: { type: "boolean" },
        meetsRule: { type: "boolean" },
      },
      required: ["definitionKnown", "meetsRule"],
    },
    ports: {
      inputs: [
        {
          id: "componentSatisfied",
          label: "Component Satisfied",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "componentKnown",
          label: "Component Known",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "requireAll",
          label: "Require All",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "definitionKnown",
          label: "Definition Known",
          valueType: { type: "boolean" },
        },
        {
          id: "meetsRule",
          label: "Meets Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = caseDefinitionComponentFlagTool.execute;
export default caseDefinitionComponentFlagTool;
