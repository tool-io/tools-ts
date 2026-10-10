import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousEndMinutes: number;
  readonly nextSeatingMinutes: number;
  readonly suppliedResetMinutes: number;
};
export type Output = {
  readonly gapMinutes: number;
  readonly resetMarginMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousEndMinutes: { type: "number" },
    nextSeatingMinutes: { type: "number" },
    suppliedResetMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "previousEndMinutes",
    "nextSeatingMinutes",
    "suppliedResetMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapMinutes: { type: "number" },
    resetMarginMinutes: { type: "number" },
  },
  required: ["gapMinutes", "resetMarginMinutes"],
} as const;
/** Compare explicit table-seating time markers with a supplied reset buffer without selecting service standards. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousEndMinutes, nextSeatingMinutes, suppliedResetMinutes } =
    request;
  const compute = (): Output => {
    H.domain(suppliedResetMinutes >= 0, "suppliedResetMinutes");
    return {
      gapMinutes: nextSeatingMinutes - previousEndMinutes,
      resetMarginMinutes:
        nextSeatingMinutes - previousEndMinutes - suppliedResetMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousEndMinutes: 60,
    nextSeatingMinutes: 80,
    suppliedResetMinutes: 15,
  },
  output: { gapMinutes: 20, resetMarginMinutes: 5 },
} satisfies ToolExample<Input, Output>;
export const restaurantTableSeatingTimeBufferTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hospitality", "business and finance"],
      keywords: ["hospitality", "business and finance"],
    },
    id: "hospitality/restaurant-table-seating-time-buffer",
    title: "Restaurant Table Seating Time Buffer",
    description:
      "Compare explicit table-seating time markers with a supplied reset buffer without selecting service standards.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousEndMinutes: { type: "number" },
        nextSeatingMinutes: { type: "number" },
        suppliedResetMinutes: { type: "number", minimum: 0 },
      },
      required: [
        "previousEndMinutes",
        "nextSeatingMinutes",
        "suppliedResetMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapMinutes: { type: "number" },
        resetMarginMinutes: { type: "number" },
      },
      required: ["gapMinutes", "resetMarginMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "previousEndMinutes",
          label: "Previous End Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextSeatingMinutes",
          label: "Next Seating Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedResetMinutes",
          label: "Supplied Reset Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "gapMinutes",
          label: "Gap Minutes",
          valueType: { type: "number" },
        },
        {
          id: "resetMarginMinutes",
          label: "Reset Margin Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = restaurantTableSeatingTimeBufferTool.execute;
export default restaurantTableSeatingTimeBufferTool;
