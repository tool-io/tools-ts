import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly returnedUnits: number;
  readonly creditableUnits: number;
  readonly suppliedUnitCredit: number;
  readonly creditOnlyAccepted: boolean;
};
export type Output = {
  readonly creditedUnits: number;
  readonly credit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnedUnits: { type: "integer", minimum: 0 },
    creditableUnits: { type: "integer", minimum: 0 },
    suppliedUnitCredit: { type: "number", minimum: 0 },
    creditOnlyAccepted: { type: "boolean" },
  },
  required: [
    "returnedUnits",
    "creditableUnits",
    "suppliedUnitCredit",
    "creditOnlyAccepted",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditedUnits: { type: "integer" },
    credit: { type: "number" },
  },
  required: ["creditedUnits", "credit"],
} as const;
/** Apply a caller-selected administrative return-credit base without judging stock usability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    returnedUnits,
    creditableUnits,
    suppliedUnitCredit,
    creditOnlyAccepted,
  } = request;
  const compute = (): Output => {
    H.integer(returnedUnits, 0);
    H.integer(creditableUnits, 0, returnedUnits);
    H.domain(suppliedUnitCredit >= 0);
    return {
      creditedUnits: creditOnlyAccepted ? creditableUnits : returnedUnits,
      credit:
        (creditOnlyAccepted ? creditableUnits : returnedUnits) *
        suppliedUnitCredit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    returnedUnits: 10,
    creditableUnits: 8,
    suppliedUnitCredit: 2,
    creditOnlyAccepted: true,
  },
  output: { creditedUnits: 8, credit: 16 },
} satisfies ToolExample<Input, Output>;
export const hospitalReturnCreditBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/hospital-return-credit-base-flag",
    title: "Hospital Return Credit Base Flag Tool",
    description:
      "Apply a caller-selected administrative return-credit base without judging stock usability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returnedUnits: { type: "integer", minimum: 0 },
        creditableUnits: { type: "integer", minimum: 0 },
        suppliedUnitCredit: { type: "number", minimum: 0 },
        creditOnlyAccepted: { type: "boolean" },
      },
      required: [
        "returnedUnits",
        "creditableUnits",
        "suppliedUnitCredit",
        "creditOnlyAccepted",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creditedUnits: { type: "integer" },
        credit: { type: "number" },
      },
      required: ["creditedUnits", "credit"],
    },
    ports: {
      inputs: [
        {
          id: "returnedUnits",
          label: "Returned Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "creditableUnits",
          label: "Creditable Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedUnitCredit",
          label: "Supplied Unit Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditOnlyAccepted",
          label: "Credit Only Accepted",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "creditedUnits",
          label: "Credited Units",
          valueType: { type: "integer" },
        },
        { id: "credit", label: "Credit", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hospitalReturnCreditBaseFlagTool.execute;
export default hospitalReturnCreditBaseFlagTool;
