import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly ageCertainty: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    ageCertainty: {
      type: "string",
      maxLength: 8192,
      enum: ["known", "estimated", "uncertain", "unknown"],
    },
  },
  required: ["observationId", "ageCertainty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Preserve explicitly recorded animal-age certainty without assigning age or an age class. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, ageCertainty } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    H.domain(
      ["known", "estimated", "uncertain", "unknown"].includes(ageCertainty),
      "ageCertainty",
    );
    return { label: observationId + " [" + ageCertainty + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationId: "O17", ageCertainty: "estimated" },
  output: { label: "O17 [estimated]" },
} satisfies ToolExample<Input, Output>;
export const animalObservationAgecertaintyCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/animal-observation-agecertainty-code",
    title: "Animal Observation Agecertainty Code Tool",
    description:
      "Preserve explicitly recorded animal-age certainty without assigning age or an age class.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationId: { type: "string", maxLength: 8192, minLength: 1 },
        ageCertainty: {
          type: "string",
          maxLength: 8192,
          enum: ["known", "estimated", "uncertain", "unknown"],
        },
      },
      required: ["observationId", "ageCertainty"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
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
          id: "ageCertainty",
          label: "Age Certainty",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = animalObservationAgecertaintyCodeTool.execute;
export default animalObservationAgecertaintyCodeTool;
