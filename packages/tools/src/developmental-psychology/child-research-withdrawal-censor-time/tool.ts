import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryDay: number;
  readonly plannedEndDay: number;
  readonly withdrawalDay: number;
  readonly withdrew: boolean;
};
export type Output = {
  readonly endDay: number;
  readonly observedDays: number;
  readonly censored: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryDay: { type: "number" },
    plannedEndDay: { type: "number" },
    withdrawalDay: { type: "number" },
    withdrew: { type: "boolean" },
  },
  required: ["entryDay", "plannedEndDay", "withdrawalDay", "withdrew"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endDay: { type: "number" },
    observedDays: { type: "number" },
    censored: { type: "boolean" },
  },
  required: ["endDay", "observedDays", "censored"],
} as const;
/** Follow-up duration under caller-identified withdrawal, without interpreting consent or retention obligations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryDay, plannedEndDay, withdrawalDay, withdrew } = request;
  const compute = (): Output => {
    H.domain(
      plannedEndDay >= entryDay && (!withdrew || withdrawalDay >= entryDay),
    );
    return {
      endDay: withdrew ? Math.min(plannedEndDay, withdrawalDay) : plannedEndDay,
      observedDays:
        (withdrew ? Math.min(plannedEndDay, withdrawalDay) : plannedEndDay) -
        entryDay,
      censored: withdrew && withdrawalDay < plannedEndDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    entryDay: 10,
    plannedEndDay: 100,
    withdrawalDay: 40,
    withdrew: true,
  },
  output: { endDay: 40, observedDays: 30, censored: true },
} satisfies ToolExample<Input, Output>;
export const childResearchWithdrawalCensorTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/child-research-withdrawal-censor-time",
    title: "Child Research Withdrawal Censor Time Tool",
    description:
      "Follow-up duration under caller-identified withdrawal, without interpreting consent or retention obligations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryDay: { type: "number" },
        plannedEndDay: { type: "number" },
        withdrawalDay: { type: "number" },
        withdrew: { type: "boolean" },
      },
      required: ["entryDay", "plannedEndDay", "withdrawalDay", "withdrew"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        endDay: { type: "number" },
        observedDays: { type: "number" },
        censored: { type: "boolean" },
      },
      required: ["endDay", "observedDays", "censored"],
    },
    ports: {
      inputs: [
        {
          id: "entryDay",
          label: "Entry Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plannedEndDay",
          label: "Planned End Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "withdrawalDay",
          label: "Withdrawal Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "withdrew",
          label: "Withdrew",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "endDay", label: "End Day", valueType: { type: "number" } },
        {
          id: "observedDays",
          label: "Observed Days",
          valueType: { type: "number" },
        },
        { id: "censored", label: "Censored", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = childResearchWithdrawalCensorTimeTool.execute;
export default childResearchWithdrawalCensorTimeTool;
