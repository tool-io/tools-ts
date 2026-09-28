import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fullRolls: number;
  readonly labelsPerRoll: number;
  readonly partialLabels: number;
  readonly issued: number;
};
export type Output = {
  readonly totalLabels: number;
  readonly remaining: number;
  readonly remainingFullRolls: number;
  readonly remainingPartial: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullRolls: { type: "integer", minimum: 0 },
    labelsPerRoll: { type: "integer", minimum: 1 },
    partialLabels: { type: "integer", minimum: 0 },
    issued: { type: "integer", minimum: 0 },
  },
  required: ["fullRolls", "labelsPerRoll", "partialLabels", "issued"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalLabels: { type: "integer" },
    remaining: { type: "integer" },
    remainingFullRolls: { type: "integer" },
    remainingPartial: { type: "integer" },
  },
  required: [
    "totalLabels",
    "remaining",
    "remainingFullRolls",
    "remainingPartial",
  ],
} as const;
/** Calculate gmp label roll partial count remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fullRolls, labelsPerRoll, partialLabels, issued } = request;
  const compute = (): Output => {
    H.integer(fullRolls, 0);
    H.integer(labelsPerRoll, 1);
    H.integer(partialLabels, 0, labelsPerRoll - 1);
    H.integer(issued, 0, fullRolls * labelsPerRoll + partialLabels);
    return {
      totalLabels: fullRolls * labelsPerRoll + partialLabels,
      remaining: fullRolls * labelsPerRoll + partialLabels - issued,
      remainingFullRolls: Math.floor(
        (fullRolls * labelsPerRoll + partialLabels - issued) / labelsPerRoll,
      ),
      remainingPartial:
        (fullRolls * labelsPerRoll + partialLabels - issued) % labelsPerRoll,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fullRolls: 3, labelsPerRoll: 100, partialLabels: 20, issued: 150 },
  output: {
    totalLabels: 320,
    remaining: 170,
    remainingFullRolls: 1,
    remainingPartial: 70,
  },
} satisfies ToolExample<Input, Output>;
export const gmpLabelRollPartialCountRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-label-roll-partial-count-remainder",
    title: "GMP Label Roll Partial Count Remainder Tool",
    description:
      "Calculate gmp label roll partial count remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullRolls: { type: "integer", minimum: 0 },
        labelsPerRoll: { type: "integer", minimum: 1 },
        partialLabels: { type: "integer", minimum: 0 },
        issued: { type: "integer", minimum: 0 },
      },
      required: ["fullRolls", "labelsPerRoll", "partialLabels", "issued"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalLabels: { type: "integer" },
        remaining: { type: "integer" },
        remainingFullRolls: { type: "integer" },
        remainingPartial: { type: "integer" },
      },
      required: [
        "totalLabels",
        "remaining",
        "remainingFullRolls",
        "remainingPartial",
      ],
    },
    ports: {
      inputs: [
        {
          id: "fullRolls",
          label: "Full Rolls",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "labelsPerRoll",
          label: "Labels Per Roll",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "partialLabels",
          label: "Partial Labels",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "issued",
          label: "Issued",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalLabels",
          label: "Total Labels",
          valueType: { type: "integer" },
        },
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
        {
          id: "remainingFullRolls",
          label: "Remaining Full Rolls",
          valueType: { type: "integer" },
        },
        {
          id: "remainingPartial",
          label: "Remaining Partial",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = gmpLabelRollPartialCountRemainderTool.execute;
export default gmpLabelRollPartialCountRemainderTool;
