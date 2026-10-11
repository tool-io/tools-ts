import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly candidateId: string;
  readonly confirmed: boolean;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    candidateId: { type: "string", maxLength: 8192, minLength: 1 },
    confirmed: { type: "boolean" },
  },
  required: ["observationId", "candidateId", "confirmed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label an explicit candidate animal identifier and confirmation flag without inferring identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, candidateId, confirmed } = request;
  const compute = (): Output => {
    H.domain(
      observationId.length > 0 && candidateId.length > 0,
      "observationId",
    );
    return {
      tag:
        observationId +
        "; candidate=" +
        JSON.stringify(candidateId) +
        "; identity=" +
        (confirmed ? "recorded-confirmed" : "uncertain"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationId: "O17", candidateId: "A3", confirmed: false },
  output: { tag: 'O17; candidate="A3"; identity=uncertain' },
} satisfies ToolExample<Input, Output>;
export const animalIdentityUncertaintyTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["zoology", "biology"],
      keywords: ["zoology", "biology"],
    },
    id: "zoology/animal-identity-uncertainty-tag",
    title: "Animal Identity Uncertainty Tag",
    description:
      "Label an explicit candidate animal identifier and confirmation flag without inferring identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationId: { type: "string", maxLength: 8192, minLength: 1 },
        candidateId: { type: "string", maxLength: 8192, minLength: 1 },
        confirmed: { type: "boolean" },
      },
      required: ["observationId", "candidateId", "confirmed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
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
          id: "candidateId",
          label: "Candidate Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "confirmed",
          label: "Confirmed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = animalIdentityUncertaintyTagTool.execute;
export default animalIdentityUncertaintyTagTool;
