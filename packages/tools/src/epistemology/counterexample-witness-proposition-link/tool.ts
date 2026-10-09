import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly propositionId: string;
  readonly witnessId: string;
  readonly suppliedRelation: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    propositionId: { type: "string", maxLength: 8192, minLength: 1 },
    witnessId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRelation: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["propositionId", "witnessId", "suppliedRelation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link an explicitly supplied proposition and witness relation without checking whether a counterexample is valid. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { propositionId, witnessId, suppliedRelation } = request;
  const compute = (): Output => {
    H.domain(propositionId.length > 0, "propositionId");
    H.domain(witnessId.length > 0, "witnessId");
    H.domain(suppliedRelation.length > 0, "suppliedRelation");
    return {
      token: JSON.stringify([propositionId, witnessId, suppliedRelation]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    propositionId: "P17",
    witnessId: "W4",
    suppliedRelation: "counterexample",
  },
  output: { token: '["P17","W4","counterexample"]' },
} satisfies ToolExample<Input, Output>;
export const counterexampleWitnessPropositionLinkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epistemology/counterexample-witness-proposition-link",
      title: "Counterexample Witness Proposition Link Tool",
      description:
        "Link an explicitly supplied proposition and witness relation without checking whether a counterexample is valid.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          propositionId: { type: "string", maxLength: 8192, minLength: 1 },
          witnessId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedRelation: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["propositionId", "witnessId", "suppliedRelation"],
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
            id: "propositionId",
            label: "Proposition Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "witnessId",
            label: "Witness Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedRelation",
            label: "Supplied Relation",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = counterexampleWitnessPropositionLinkTool.execute;
export default counterexampleWitnessPropositionLinkTool;
