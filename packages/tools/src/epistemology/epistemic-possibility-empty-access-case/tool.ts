import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly accessibleTruths: readonly boolean[] };
export type Output = {
  readonly possiblyTrue: boolean;
  readonly necessarilyTrue: boolean;
  readonly emptyAccess: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accessibleTruths: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["accessibleTruths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    possiblyTrue: { type: "boolean" },
    necessarilyTrue: { type: "boolean" },
    emptyAccess: { type: "boolean" },
  },
  required: ["possiblyTrue", "necessarilyTrue", "emptyAccess"],
} as const;
/** Kripke existential possibility and universal necessity over an explicit accessibility set, including vacuous universal truth for empty access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { accessibleTruths } = request;
  const compute = (): Output => {
    return {
      possiblyTrue: accessibleTruths.some(Boolean),
      necessarilyTrue: accessibleTruths.every(Boolean),
      emptyAccess: accessibleTruths.length === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { accessibleTruths: [false, true] },
  output: { possiblyTrue: true, necessarilyTrue: false, emptyAccess: false },
} satisfies ToolExample<Input, Output>;
export const epistemicPossibilityEmptyAccessCaseTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epistemology/epistemic-possibility-empty-access-case",
      title: "Epistemic Possibility Empty Access Case Tool",
      description:
        "Kripke existential possibility and universal necessity over an explicit accessibility set, including vacuous universal truth for empty access.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          accessibleTruths: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
        },
        required: ["accessibleTruths"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          possiblyTrue: { type: "boolean" },
          necessarilyTrue: { type: "boolean" },
          emptyAccess: { type: "boolean" },
        },
        required: ["possiblyTrue", "necessarilyTrue", "emptyAccess"],
      },
      ports: {
        inputs: [
          {
            id: "accessibleTruths",
            label: "Accessible Truths",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
        outputs: [
          {
            id: "possiblyTrue",
            label: "Possibly True",
            valueType: { type: "boolean" },
          },
          {
            id: "necessarilyTrue",
            label: "Necessarily True",
            valueType: { type: "boolean" },
          },
          {
            id: "emptyAccess",
            label: "Empty Access",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = epistemicPossibilityEmptyAccessCaseTool.execute;
export default epistemicPossibilityEmptyAccessCaseTool;
