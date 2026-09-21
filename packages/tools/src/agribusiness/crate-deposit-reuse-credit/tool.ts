import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issued: number;
  readonly returned: number;
  readonly reusedWithoutNewDeposit: number;
  readonly depositEach: number;
};
export type Output = {
  readonly charged: number;
  readonly credited: number;
  readonly balance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issued: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    reusedWithoutNewDeposit: { type: "integer", minimum: 0 },
    depositEach: { type: "number", minimum: 0 },
  },
  required: ["issued", "returned", "reusedWithoutNewDeposit", "depositEach"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    charged: { type: "number" },
    credited: { type: "number" },
    balance: { type: "number" },
  },
  required: ["charged", "credited", "balance"],
} as const;
/** Calculate crate deposit reuse credit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issued, returned, reusedWithoutNewDeposit, depositEach } = request;
  const compute = (): Output => {
    H.integer(issued, 0);
    H.integer(returned, 0);
    H.integer(reusedWithoutNewDeposit, 0, issued);
    H.domain(depositEach >= 0);
    return {
      charged: (issued - reusedWithoutNewDeposit) * depositEach,
      credited: returned * depositEach,
      balance: (issued - reusedWithoutNewDeposit - returned) * depositEach,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    issued: 100,
    returned: 60,
    reusedWithoutNewDeposit: 10,
    depositEach: 2,
  },
  output: { charged: 180, credited: 120, balance: 60 },
} satisfies ToolExample<Input, Output>;
export const crateDepositReuseCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/crate-deposit-reuse-credit",
    title: "Crate Deposit Reuse Credit Tool",
    description:
      "Calculate crate deposit reuse credit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issued: { type: "integer", minimum: 0 },
        returned: { type: "integer", minimum: 0 },
        reusedWithoutNewDeposit: { type: "integer", minimum: 0 },
        depositEach: { type: "number", minimum: 0 },
      },
      required: [
        "issued",
        "returned",
        "reusedWithoutNewDeposit",
        "depositEach",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        charged: { type: "number" },
        credited: { type: "number" },
        balance: { type: "number" },
      },
      required: ["charged", "credited", "balance"],
    },
    ports: {
      inputs: [
        {
          id: "issued",
          label: "Issued",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reusedWithoutNewDeposit",
          label: "Reused Without New Deposit",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "depositEach",
          label: "Deposit Each",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "charged", label: "Charged", valueType: { type: "number" } },
        { id: "credited", label: "Credited", valueType: { type: "number" } },
        { id: "balance", label: "Balance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = crateDepositReuseCreditTool.execute;
export default crateDepositReuseCreditTool;
