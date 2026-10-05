import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly presentMembers: number;
  readonly requiredMembers: number;
};
export type Output = {
  readonly quorumMet: boolean;
  readonly shortfall: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentMembers: { type: "integer", minimum: 0 },
    requiredMembers: { type: "integer", minimum: 0 },
  },
  required: ["presentMembers", "requiredMembers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quorumMet: { type: "boolean" },
    shortfall: { type: "integer" },
  },
  required: ["quorumMet", "shortfall"],
} as const;
/** Compare recorded eligible attendance with an explicitly supplied quorum count without choosing a statutory rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { presentMembers, requiredMembers } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(presentMembers) &&
        presentMembers >= 0 &&
        presentMembers <= Number.MAX_SAFE_INTEGER,
      "presentMembers",
    ),
      presentMembers);
    (H.domain(
      Number.isSafeInteger(requiredMembers) &&
        requiredMembers >= 0 &&
        requiredMembers <= Number.MAX_SAFE_INTEGER,
      "requiredMembers",
    ),
      requiredMembers);
    return {
      quorumMet: presentMembers >= requiredMembers,
      shortfall: Math.max(0, requiredMembers - presentMembers),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { presentMembers: 7, requiredMembers: 6 },
  output: { quorumMet: true, shortfall: 0 },
} satisfies ToolExample<Input, Output>;
export const publicmeetingQuorumCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/publicmeeting-quorum-count",
    title: "Publicmeeting Quorum Count Tool",
    description:
      "Compare recorded eligible attendance with an explicitly supplied quorum count without choosing a statutory rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presentMembers: { type: "integer", minimum: 0 },
        requiredMembers: { type: "integer", minimum: 0 },
      },
      required: ["presentMembers", "requiredMembers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quorumMet: { type: "boolean" },
        shortfall: { type: "integer" },
      },
      required: ["quorumMet", "shortfall"],
    },
    ports: {
      inputs: [
        {
          id: "presentMembers",
          label: "Present Members",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requiredMembers",
          label: "Required Members",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "quorumMet",
          label: "Quorum Met",
          valueType: { type: "boolean" },
        },
        { id: "shortfall", label: "Shortfall", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = publicmeetingQuorumCountTool.execute;
export default publicmeetingQuorumCountTool;
