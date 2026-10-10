import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPassGood: number;
  readonly reworkedUnits: number;
  readonly acceptedReworkedUnits: number;
};
export type Output = {
  readonly totalAccepted: number;
  readonly rejectedRework: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPassGood: { type: "integer", minimum: 0 },
    reworkedUnits: { type: "integer", minimum: 0 },
    acceptedReworkedUnits: { type: "integer", minimum: 0 },
  },
  required: ["firstPassGood", "reworkedUnits", "acceptedReworkedUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalAccepted: { type: "integer" },
    rejectedRework: { type: "integer" },
  },
  required: ["totalAccepted", "rejectedRework"],
} as const;
/** Reconcile explicit disjoint first-pass and accepted-rework unit counts without selecting quality acceptance criteria. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPassGood, reworkedUnits, acceptedReworkedUnits } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(firstPassGood) &&
        firstPassGood >= 0 &&
        firstPassGood <= Number.MAX_SAFE_INTEGER,
      "firstPassGood",
    ),
      firstPassGood);
    (H.domain(
      Number.isSafeInteger(reworkedUnits) &&
        reworkedUnits >= 0 &&
        reworkedUnits <= Number.MAX_SAFE_INTEGER,
      "reworkedUnits",
    ),
      reworkedUnits);
    (H.domain(
      Number.isSafeInteger(acceptedReworkedUnits) &&
        acceptedReworkedUnits >= 0 &&
        acceptedReworkedUnits <= reworkedUnits,
      "acceptedReworkedUnits",
    ),
      acceptedReworkedUnits);
    return {
      totalAccepted: Number(
        BigInt(firstPassGood) + BigInt(acceptedReworkedUnits),
      ),
      rejectedRework: reworkedUnits - acceptedReworkedUnits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPassGood: 100, reworkedUnits: 20, acceptedReworkedUnits: 15 },
  output: { totalAccepted: 115, rejectedRework: 5 },
} satisfies ToolExample<Input, Output>;
export const productionReworkGoodUnitCreditTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/production-rework-good-unit-credit-term",
    title: "Production Rework Good Unit Credit Term Tool",
    description:
      "Reconcile explicit disjoint first-pass and accepted-rework unit counts without selecting quality acceptance criteria.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPassGood: { type: "integer", minimum: 0 },
        reworkedUnits: { type: "integer", minimum: 0 },
        acceptedReworkedUnits: { type: "integer", minimum: 0 },
      },
      required: ["firstPassGood", "reworkedUnits", "acceptedReworkedUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalAccepted: { type: "integer" },
        rejectedRework: { type: "integer" },
      },
      required: ["totalAccepted", "rejectedRework"],
    },
    ports: {
      inputs: [
        {
          id: "firstPassGood",
          label: "First Pass Good",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reworkedUnits",
          label: "Reworked Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "acceptedReworkedUnits",
          label: "Accepted Reworked Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalAccepted",
          label: "Total Accepted",
          valueType: { type: "integer" },
        },
        {
          id: "rejectedRework",
          label: "Rejected Rework",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = productionReworkGoodUnitCreditTermTool.execute;
export default productionReworkGoodUnitCreditTermTool;
