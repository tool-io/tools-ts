import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableMinutes: number;
  readonly diningMinutes: number;
  readonly resetMinutes: number;
  readonly parties: number;
};
export type Output = { readonly remainingMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableMinutes: { type: "number", minimum: 0 },
    diningMinutes: { type: "number", minimum: 0 },
    resetMinutes: { type: "number", minimum: 0 },
    parties: { type: "integer", minimum: 0 },
  },
  required: ["availableMinutes", "diningMinutes", "resetMinutes", "parties"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingMinutes: { type: "number" } },
  required: ["remainingMinutes"],
} as const;
/** Budget supplied seating durations with reset intervals only between parties. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableMinutes, diningMinutes, resetMinutes, parties } = request;
  const compute = (): Output => {
    H.integer(parties, 0);
    H.domain(availableMinutes >= 0 && diningMinutes >= 0 && resetMinutes >= 0);
    return {
      remainingMinutes:
        availableMinutes -
        parties * diningMinutes -
        Math.max(0, parties - 1) * resetMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    availableMinutes: 180,
    diningMinutes: 50,
    resetMinutes: 10,
    parties: 3,
  },
  output: { remainingMinutes: 10 },
} satisfies ToolExample<Input, Output>;
export const tableTurnoverBufferLeftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/table-turnover-buffer-left",
    title: "Table Turnover Buffer Left Tool",
    description:
      "Budget supplied seating durations with reset intervals only between parties.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableMinutes: { type: "number", minimum: 0 },
        diningMinutes: { type: "number", minimum: 0 },
        resetMinutes: { type: "number", minimum: 0 },
        parties: { type: "integer", minimum: 0 },
      },
      required: [
        "availableMinutes",
        "diningMinutes",
        "resetMinutes",
        "parties",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingMinutes: { type: "number" } },
      required: ["remainingMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "availableMinutes",
          label: "Available Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "diningMinutes",
          label: "Dining Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "resetMinutes",
          label: "Reset Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "parties",
          label: "Parties",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingMinutes",
          label: "Remaining Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tableTurnoverBufferLeftTool.execute;
export default tableTurnoverBufferLeftTool;
