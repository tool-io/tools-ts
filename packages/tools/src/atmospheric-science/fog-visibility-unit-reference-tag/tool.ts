import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly visibilityText: string;
  readonly unitText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    visibilityText: { type: "string", maxLength: 8192, minLength: 1 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observationId", "visibilityText", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit reported visibility and unit text without classifying fog or making aviation decisions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, visibilityText, unitText } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    H.domain(visibilityText.length > 0, "visibilityText");
    H.domain(unitText.length > 0, "unitText");
    return { token: JSON.stringify([observationId, visibilityText, unitText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationId: "O17", visibilityText: "400", unitText: "m" },
  output: { token: '["O17","400","m"]' },
} satisfies ToolExample<Input, Output>;
export const fogVisibilityUnitReferenceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "atmospheric-science",
        "atmospheric science",
        "earth and environmental sciences",
      ],
      keywords: ["atmospheric science", "earth and environmental sciences"],
    },
    id: "atmospheric-science/fog-visibility-unit-reference-tag",
    title: "Fog Visibility Unit Reference Tag",
    description:
      "Preserve explicit reported visibility and unit text without classifying fog or making aviation decisions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationId: { type: "string", maxLength: 8192, minLength: 1 },
        visibilityText: { type: "string", maxLength: 8192, minLength: 1 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["observationId", "visibilityText", "unitText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "observationId",
          label: "Observation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "visibilityText",
          label: "Visibility Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fogVisibilityUnitReferenceTagTool.execute;
export default fogVisibilityUnitReferenceTagTool;
