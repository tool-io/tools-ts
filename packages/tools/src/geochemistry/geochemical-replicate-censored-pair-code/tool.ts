import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstReplicateId: string;
  readonly secondReplicateId: string;
  readonly censoringConvention: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstReplicateId: { type: "string", maxLength: 8192, minLength: 1 },
    secondReplicateId: { type: "string", maxLength: 8192, minLength: 1 },
    censoringConvention: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["firstReplicateId", "secondReplicateId", "censoringConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicitly supplied replicate-pair censoring metadata without substituting values or computing precision from censored results. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstReplicateId, secondReplicateId, censoringConvention } = request;
  const compute = (): Output => {
    H.domain(firstReplicateId.length > 0, "firstReplicateId");
    H.domain(secondReplicateId.length > 0, "secondReplicateId");
    H.domain(censoringConvention.length > 0, "censoringConvention");
    return {
      token: JSON.stringify([
        firstReplicateId,
        secondReplicateId,
        censoringConvention,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstReplicateId: "R17",
    secondReplicateId: "R18",
    censoringConvention: "both below limit",
  },
  output: { token: '["R17","R18","both below limit"]' },
} satisfies ToolExample<Input, Output>;
export const geochemicalReplicateCensoredPairCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geochemistry/geochemical-replicate-censored-pair-code",
      title: "Geochemical Replicate Censored Pair Code Tool",
      description:
        "Preserve explicitly supplied replicate-pair censoring metadata without substituting values or computing precision from censored results.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstReplicateId: { type: "string", maxLength: 8192, minLength: 1 },
          secondReplicateId: { type: "string", maxLength: 8192, minLength: 1 },
          censoringConvention: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: [
          "firstReplicateId",
          "secondReplicateId",
          "censoringConvention",
        ],
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
            id: "firstReplicateId",
            label: "First Replicate Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondReplicateId",
            label: "Second Replicate Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "censoringConvention",
            label: "Censoring Convention",
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
export const run = geochemicalReplicateCensoredPairCodeTool.execute;
export default geochemicalReplicateCensoredPairCodeTool;
