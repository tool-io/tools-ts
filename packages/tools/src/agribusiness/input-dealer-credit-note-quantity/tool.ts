import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly returned: number;
  readonly packSize: number;
  readonly pricePerPack: number;
  readonly restockingFraction: number;
};
export type Output = {
  readonly wholePacks: number;
  readonly remainderUnits: number;
  readonly credit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returned: { type: "integer", minimum: 0 },
    packSize: { type: "integer", minimum: 1 },
    pricePerPack: { type: "number", minimum: 0 },
    restockingFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["returned", "packSize", "pricePerPack", "restockingFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wholePacks: { type: "integer" },
    remainderUnits: { type: "integer" },
    credit: { type: "number" },
  },
  required: ["wholePacks", "remainderUnits", "credit"],
} as const;
/** Credit complete returned packs only, with an explicit restocking deduction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { returned, packSize, pricePerPack, restockingFraction } = request;
  const compute = (): Output => {
    H.integer(returned, 0);
    H.integer(packSize, 1);
    H.domain(pricePerPack >= 0);
    H.probability(restockingFraction);
    return {
      wholePacks: Math.floor(returned / packSize),
      remainderUnits: returned % packSize,
      credit:
        Math.floor(returned / packSize) *
        pricePerPack *
        (1 - restockingFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    returned: 25,
    packSize: 10,
    pricePerPack: 40,
    restockingFraction: 0.1,
  },
  output: { wholePacks: 2, remainderUnits: 5, credit: 72 },
} satisfies ToolExample<Input, Output>;
export const inputDealerCreditNoteQuantityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/input-dealer-credit-note-quantity",
    title: "Input Dealer Credit Note Quantity Tool",
    description:
      "Credit complete returned packs only, with an explicit restocking deduction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returned: { type: "integer", minimum: 0 },
        packSize: { type: "integer", minimum: 1 },
        pricePerPack: { type: "number", minimum: 0 },
        restockingFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["returned", "packSize", "pricePerPack", "restockingFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wholePacks: { type: "integer" },
        remainderUnits: { type: "integer" },
        credit: { type: "number" },
      },
      required: ["wholePacks", "remainderUnits", "credit"],
    },
    ports: {
      inputs: [
        {
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "packSize",
          label: "Pack Size",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pricePerPack",
          label: "Price Per Pack",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "restockingFraction",
          label: "Restocking Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wholePacks",
          label: "Whole Packs",
          valueType: { type: "integer" },
        },
        {
          id: "remainderUnits",
          label: "Remainder Units",
          valueType: { type: "integer" },
        },
        { id: "credit", label: "Credit", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = inputDealerCreditNoteQuantityTool.execute;
export default inputDealerCreditNoteQuantityTool;
