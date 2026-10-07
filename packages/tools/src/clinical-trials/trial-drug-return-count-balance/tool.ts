import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dispensedUnits: number;
  readonly additionalUnits: number;
  readonly returnedUnits: number;
};
export type Output = { readonly closingBalance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dispensedUnits: { type: "integer", minimum: 0 },
    additionalUnits: { type: "integer", minimum: 0 },
    returnedUnits: { type: "integer", minimum: 0 },
  },
  required: ["dispensedUnits", "additionalUnits", "returnedUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingBalance: { type: "integer" } },
  required: ["closingBalance"],
} as const;
/** Reconcile explicit trial-drug dispensed and returned unit counts without inferring ingestion or adherence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dispensedUnits, additionalUnits, returnedUnits } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(dispensedUnits) &&
        dispensedUnits >= 0 &&
        dispensedUnits <= Number.MAX_SAFE_INTEGER,
      "dispensedUnits",
    ),
      dispensedUnits);
    (H.domain(
      Number.isSafeInteger(additionalUnits) &&
        additionalUnits >= 0 &&
        additionalUnits <= Number.MAX_SAFE_INTEGER,
      "additionalUnits",
    ),
      additionalUnits);
    (H.domain(
      Number.isSafeInteger(returnedUnits) &&
        returnedUnits >= 0 &&
        returnedUnits <= Number.MAX_SAFE_INTEGER,
      "returnedUnits",
    ),
      returnedUnits);
    return {
      closingBalance: Number(
        BigInt(dispensedUnits) +
          BigInt(additionalUnits) -
          BigInt(returnedUnits),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dispensedUnits: 20, additionalUnits: 8, returnedUnits: 5 },
  output: { closingBalance: 23 },
} satisfies ToolExample<Input, Output>;
export const trialDrugReturnCountBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "clinical-trials",
        "clinical trials",
        "research and quality management",
      ],
      keywords: ["clinical trials", "research and quality management"],
    },
    id: "clinical-trials/trial-drug-return-count-balance",
    title: "Trial Drug Return Count Balance",
    description:
      "Reconcile explicit trial-drug dispensed and returned unit counts without inferring ingestion or adherence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dispensedUnits: { type: "integer", minimum: 0 },
        additionalUnits: { type: "integer", minimum: 0 },
        returnedUnits: { type: "integer", minimum: 0 },
      },
      required: ["dispensedUnits", "additionalUnits", "returnedUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingBalance: { type: "integer" } },
      required: ["closingBalance"],
    },
    ports: {
      inputs: [
        {
          id: "dispensedUnits",
          label: "Dispensed Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "additionalUnits",
          label: "Additional Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "returnedUnits",
          label: "Returned Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "closingBalance",
          label: "Closing Balance",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialDrugReturnCountBalanceTool.execute;
export default trialDrugReturnCountBalanceTool;
