import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingMilliliters: number;
  readonly addedMilliliters: number;
  readonly emptiedMilliliters: number;
  readonly recordedClosingMilliliters: number;
};
export type Output = {
  readonly expectedClosingMilliliters: number;
  readonly discrepancyMilliliters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingMilliliters: { type: "number", minimum: 0 },
    addedMilliliters: { type: "number", minimum: 0 },
    emptiedMilliliters: { type: "number", minimum: 0 },
    recordedClosingMilliliters: { type: "number", minimum: 0 },
  },
  required: [
    "openingMilliliters",
    "addedMilliliters",
    "emptiedMilliliters",
    "recordedClosingMilliliters",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedClosingMilliliters: { type: "number" },
    discrepancyMilliliters: { type: "number" },
  },
  required: ["expectedClosingMilliliters", "discrepancyMilliliters"],
} as const;
/** Reconcile explicit catheter-bag volume movements without inferring urine production or fluid balance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    openingMilliliters,
    addedMilliliters,
    emptiedMilliliters,
    recordedClosingMilliliters,
  } = request;
  const compute = (): Output => {
    H.domain(
      openingMilliliters >= 0 &&
        addedMilliliters >= 0 &&
        emptiedMilliliters >= 0 &&
        recordedClosingMilliliters >= 0,
      "openingMilliliters",
    );
    return {
      expectedClosingMilliliters:
        openingMilliliters + addedMilliliters - emptiedMilliliters,
      discrepancyMilliliters:
        recordedClosingMilliliters -
        (openingMilliliters + addedMilliliters - emptiedMilliliters),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingMilliliters: 100,
    addedMilliliters: 250,
    emptiedMilliliters: 300,
    recordedClosingMilliliters: 45,
  },
  output: { expectedClosingMilliliters: 50, discrepancyMilliliters: -5 },
} satisfies ToolExample<Input, Output>;
export const urinaryCatheterBagChangeBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["urology", "health and medicine"],
      keywords: ["urology", "health and medicine"],
    },
    id: "urology/urinary-catheter-bag-change-balance",
    title: "Urinary Catheter Bag Change Balance",
    description:
      "Reconcile explicit catheter-bag volume movements without inferring urine production or fluid balance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingMilliliters: { type: "number", minimum: 0 },
        addedMilliliters: { type: "number", minimum: 0 },
        emptiedMilliliters: { type: "number", minimum: 0 },
        recordedClosingMilliliters: { type: "number", minimum: 0 },
      },
      required: [
        "openingMilliliters",
        "addedMilliliters",
        "emptiedMilliliters",
        "recordedClosingMilliliters",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedClosingMilliliters: { type: "number" },
        discrepancyMilliliters: { type: "number" },
      },
      required: ["expectedClosingMilliliters", "discrepancyMilliliters"],
    },
    ports: {
      inputs: [
        {
          id: "openingMilliliters",
          label: "Opening Milliliters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addedMilliliters",
          label: "Added Milliliters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "emptiedMilliliters",
          label: "Emptied Milliliters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedClosingMilliliters",
          label: "Recorded Closing Milliliters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedClosingMilliliters",
          label: "Expected Closing Milliliters",
          valueType: { type: "number" },
        },
        {
          id: "discrepancyMilliliters",
          label: "Discrepancy Milliliters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = urinaryCatheterBagChangeBalanceTool.execute;
export default urinaryCatheterBagChangeBalanceTool;
