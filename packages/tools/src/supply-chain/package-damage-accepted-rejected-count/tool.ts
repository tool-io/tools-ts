import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly received: number;
  readonly damaged: number;
  readonly acceptedDamaged: number;
};
export type Output = {
  readonly undamaged: number;
  readonly rejected: number;
  readonly accepted: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    received: { type: "integer", minimum: 0 },
    damaged: { type: "integer", minimum: 0 },
    acceptedDamaged: { type: "integer", minimum: 0 },
  },
  required: ["received", "damaged", "acceptedDamaged"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    undamaged: { type: "integer" },
    rejected: { type: "integer" },
    accepted: { type: "integer" },
  },
  required: ["undamaged", "rejected", "accepted"],
} as const;
/** Calculate package damage accepted rejected count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { received, damaged, acceptedDamaged } = request;
  const compute = (): Output => {
    H.integer(received, 0);
    H.integer(damaged, 0, received);
    H.integer(acceptedDamaged, 0, damaged);
    return {
      undamaged: received - damaged,
      rejected: damaged - acceptedDamaged,
      accepted: received - damaged + acceptedDamaged,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { received: 100, damaged: 10, acceptedDamaged: 3 },
  output: { undamaged: 90, rejected: 7, accepted: 93 },
} satisfies ToolExample<Input, Output>;
export const packageDamageAcceptedRejectedCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/package-damage-accepted-rejected-count",
    title: "Package Damage Accepted Rejected Count Tool",
    description:
      "Calculate package damage accepted rejected count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        received: { type: "integer", minimum: 0 },
        damaged: { type: "integer", minimum: 0 },
        acceptedDamaged: { type: "integer", minimum: 0 },
      },
      required: ["received", "damaged", "acceptedDamaged"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        undamaged: { type: "integer" },
        rejected: { type: "integer" },
        accepted: { type: "integer" },
      },
      required: ["undamaged", "rejected", "accepted"],
    },
    ports: {
      inputs: [
        {
          id: "received",
          label: "Received",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "damaged",
          label: "Damaged",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "acceptedDamaged",
          label: "Accepted Damaged",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "undamaged", label: "Undamaged", valueType: { type: "integer" } },
        { id: "rejected", label: "Rejected", valueType: { type: "integer" } },
        { id: "accepted", label: "Accepted", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = packageDamageAcceptedRejectedCountTool.execute;
export default packageDamageAcceptedRejectedCountTool;
