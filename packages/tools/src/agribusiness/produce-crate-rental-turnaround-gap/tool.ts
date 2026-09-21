import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly checkoutDay: number;
  readonly returnDay: number;
  readonly includedDays: number;
  readonly dailyRate: number;
  readonly crates: number;
};
export type Output = {
  readonly heldDays: number;
  readonly billableDays: number;
  readonly rental: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    checkoutDay: { type: "number" },
    returnDay: { type: "number" },
    includedDays: { type: "number", minimum: 0 },
    dailyRate: { type: "number", minimum: 0 },
    crates: { type: "integer", minimum: 0 },
  },
  required: ["checkoutDay", "returnDay", "includedDays", "dailyRate", "crates"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heldDays: { type: "number" },
    billableDays: { type: "number" },
    rental: { type: "number" },
  },
  required: ["heldDays", "billableDays", "rental"],
} as const;
/** Calculate produce crate rental turnaround gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { checkoutDay, returnDay, includedDays, dailyRate, crates } = request;
  const compute = (): Output => {
    H.domain(returnDay >= checkoutDay && includedDays >= 0 && dailyRate >= 0);
    H.integer(crates, 0);
    return {
      heldDays: returnDay - checkoutDay,
      billableDays: Math.max(0, returnDay - checkoutDay - includedDays),
      rental:
        Math.max(0, returnDay - checkoutDay - includedDays) *
        dailyRate *
        crates,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    checkoutDay: 10,
    returnDay: 17,
    includedDays: 2,
    dailyRate: 0.5,
    crates: 100,
  },
  output: { heldDays: 7, billableDays: 5, rental: 250 },
} satisfies ToolExample<Input, Output>;
export const produceCrateRentalTurnaroundGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/produce-crate-rental-turnaround-gap",
    title: "Produce Crate Rental Turnaround Gap Tool",
    description:
      "Calculate produce crate rental turnaround gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        checkoutDay: { type: "number" },
        returnDay: { type: "number" },
        includedDays: { type: "number", minimum: 0 },
        dailyRate: { type: "number", minimum: 0 },
        crates: { type: "integer", minimum: 0 },
      },
      required: [
        "checkoutDay",
        "returnDay",
        "includedDays",
        "dailyRate",
        "crates",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heldDays: { type: "number" },
        billableDays: { type: "number" },
        rental: { type: "number" },
      },
      required: ["heldDays", "billableDays", "rental"],
    },
    ports: {
      inputs: [
        {
          id: "checkoutDay",
          label: "Checkout Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnDay",
          label: "Return Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includedDays",
          label: "Included Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dailyRate",
          label: "Daily Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "crates",
          label: "Crates",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "heldDays", label: "Held Days", valueType: { type: "number" } },
        {
          id: "billableDays",
          label: "Billable Days",
          valueType: { type: "number" },
        },
        { id: "rental", label: "Rental", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = produceCrateRentalTurnaroundGapTool.execute;
export default produceCrateRentalTurnaroundGapTool;
