import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly triggerPresent: boolean;
  readonly triggerMatches: boolean;
  readonly dependentPresent: boolean;
};
export type Output = {
  readonly dependencyActive: boolean;
  readonly satisfied: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    triggerPresent: { type: "boolean" },
    triggerMatches: { type: "boolean" },
    dependentPresent: { type: "boolean" },
  },
  required: ["triggerPresent", "triggerMatches", "dependentPresent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dependencyActive: { type: "boolean" },
    satisfied: { type: "boolean" },
  },
  required: ["dependencyActive", "satisfied"],
} as const;
/** Calculate field dependency activation flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { triggerPresent, triggerMatches, dependentPresent } = request;
  const compute = (): Output => {
    return {
      dependencyActive: triggerPresent && triggerMatches,
      satisfied: !triggerPresent || !triggerMatches || dependentPresent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    triggerPresent: true,
    triggerMatches: true,
    dependentPresent: false,
  },
  output: { dependencyActive: true, satisfied: false },
} satisfies ToolExample<Input, Output>;
export const fieldDependencyActivationFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/field-dependency-activation-flag",
    title: "Field Dependency Activation Flag Tool",
    description:
      "Calculate field dependency activation flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        triggerPresent: { type: "boolean" },
        triggerMatches: { type: "boolean" },
        dependentPresent: { type: "boolean" },
      },
      required: ["triggerPresent", "triggerMatches", "dependentPresent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dependencyActive: { type: "boolean" },
        satisfied: { type: "boolean" },
      },
      required: ["dependencyActive", "satisfied"],
    },
    ports: {
      inputs: [
        {
          id: "triggerPresent",
          label: "Trigger Present",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "triggerMatches",
          label: "Trigger Matches",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "dependentPresent",
          label: "Dependent Present",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "dependencyActive",
          label: "Dependency Active",
          valueType: { type: "boolean" },
        },
        { id: "satisfied", label: "Satisfied", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = fieldDependencyActivationFlagTool.execute;
export default fieldDependencyActivationFlagTool;
