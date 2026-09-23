import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentDay: number;
  readonly lastTrainingDay: number;
  readonly suppliedValidityDays: number;
  readonly suppliedReserveDays: number;
};
export type Output = {
  readonly expiryDay: number;
  readonly remainingDays: number;
  readonly bufferAfterReserve: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentDay: { type: "integer" },
    lastTrainingDay: { type: "integer" },
    suppliedValidityDays: { type: "integer", minimum: 0 },
    suppliedReserveDays: { type: "integer", minimum: 0 },
  },
  required: [
    "currentDay",
    "lastTrainingDay",
    "suppliedValidityDays",
    "suppliedReserveDays",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expiryDay: { type: "integer" },
    remainingDays: { type: "integer" },
    bufferAfterReserve: { type: "integer" },
  },
  required: ["expiryDay", "remainingDays", "bufferAfterReserve"],
} as const;
/** Administrative supplied training-calendar ledger without selecting recertification policy or certifying qualification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    currentDay,
    lastTrainingDay,
    suppliedValidityDays,
    suppliedReserveDays,
  } = request;
  const compute = (): Output => {
    H.integer(suppliedValidityDays, 0);
    H.integer(suppliedReserveDays, 0);
    return {
      expiryDay: lastTrainingDay + suppliedValidityDays,
      remainingDays: lastTrainingDay + suppliedValidityDays - currentDay,
      bufferAfterReserve:
        lastTrainingDay +
        suppliedValidityDays -
        currentDay -
        suppliedReserveDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    currentDay: 120,
    lastTrainingDay: 100,
    suppliedValidityDays: 30,
    suppliedReserveDays: 5,
  },
  output: { expiryDay: 130, remainingDays: 10, bufferAfterReserve: 5 },
} satisfies ToolExample<Input, Output>;
export const trainingRecertificationBufferTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/training-recertification-buffer",
    title: "Training Recertification Buffer Tool",
    description:
      "Administrative supplied training-calendar ledger without selecting recertification policy or certifying qualification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentDay: { type: "integer" },
        lastTrainingDay: { type: "integer" },
        suppliedValidityDays: { type: "integer", minimum: 0 },
        suppliedReserveDays: { type: "integer", minimum: 0 },
      },
      required: [
        "currentDay",
        "lastTrainingDay",
        "suppliedValidityDays",
        "suppliedReserveDays",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expiryDay: { type: "integer" },
        remainingDays: { type: "integer" },
        bufferAfterReserve: { type: "integer" },
      },
      required: ["expiryDay", "remainingDays", "bufferAfterReserve"],
    },
    ports: {
      inputs: [
        {
          id: "currentDay",
          label: "Current Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastTrainingDay",
          label: "Last Training Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedValidityDays",
          label: "Supplied Validity Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedReserveDays",
          label: "Supplied Reserve Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "expiryDay",
          label: "Expiry Day",
          valueType: { type: "integer" },
        },
        {
          id: "remainingDays",
          label: "Remaining Days",
          valueType: { type: "integer" },
        },
        {
          id: "bufferAfterReserve",
          label: "Buffer After Reserve",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = trainingRecertificationBufferTool.execute;
export default trainingRecertificationBufferTool;
