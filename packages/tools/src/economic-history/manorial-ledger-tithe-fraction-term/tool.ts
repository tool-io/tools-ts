import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedProduction: number;
  readonly suppliedTitheFraction: number;
};
export type Output = {
  readonly titheQuantity: number;
  readonly retainedQuantity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedProduction: { type: "number", minimum: 0 },
    suppliedTitheFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["recordedProduction", "suppliedTitheFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    titheQuantity: { type: "number" },
    retainedQuantity: { type: "number" },
  },
  required: ["titheQuantity", "retainedQuantity"],
} as const;
/** Apply an explicitly supplied ledger tithe fraction without presuming a universal historical rate or eligible production base. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedProduction, suppliedTitheFraction } = request;
  const compute = (): Output => {
    H.domain(recordedProduction >= 0, "recordedProduction");
    (H.domain(
      suppliedTitheFraction >= 0 && suppliedTitheFraction <= 1,
      "suppliedTitheFraction",
    ),
      suppliedTitheFraction);
    return {
      titheQuantity: recordedProduction * suppliedTitheFraction,
      retainedQuantity: recordedProduction * (1 - suppliedTitheFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedProduction: 200, suppliedTitheFraction: 0.1 },
  output: { titheQuantity: 20, retainedQuantity: 180 },
} satisfies ToolExample<Input, Output>;
export const manorialLedgerTitheFractionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/manorial-ledger-tithe-fraction-term",
    title: "Manorial Ledger Tithe Fraction Term Tool",
    description:
      "Apply an explicitly supplied ledger tithe fraction without presuming a universal historical rate or eligible production base.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedProduction: { type: "number", minimum: 0 },
        suppliedTitheFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["recordedProduction", "suppliedTitheFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        titheQuantity: { type: "number" },
        retainedQuantity: { type: "number" },
      },
      required: ["titheQuantity", "retainedQuantity"],
    },
    ports: {
      inputs: [
        {
          id: "recordedProduction",
          label: "Recorded Production",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTitheFraction",
          label: "Supplied Tithe Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "titheQuantity",
          label: "Tithe Quantity",
          valueType: { type: "number" },
        },
        {
          id: "retainedQuantity",
          label: "Retained Quantity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = manorialLedgerTitheFractionTermTool.execute;
export default manorialLedgerTitheFractionTermTool;
