import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly payments: readonly number[];
  readonly eligibilityVerified: readonly boolean[];
  readonly rateVerified: readonly boolean[];
  readonly sourceCurrent: readonly boolean[];
};
export type Output = {
  readonly paymentTotal: number;
  readonly supportedTotal: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    payments: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    eligibilityVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    rateVerified: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sourceCurrent: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: [
    "payments",
    "eligibilityVerified",
    "rateVerified",
    "sourceCurrent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    paymentTotal: { type: "number" },
    supportedTotal: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["paymentTotal", "supportedTotal", "share", "defined"],
} as const;
/** Calculate farm payment support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { payments, eligibilityVerified, rateVerified, sourceCurrent } =
    request;
  const compute = (): Output => {
    H.sameLength(payments, eligibilityVerified);
    H.sameLength(payments, rateVerified);
    H.sameLength(payments, sourceCurrent);
    H.domain(payments.every((x) => x >= 0));
    return (() => {
      const paymentTotal = payments.reduce((a, b) => a + b, 0),
        supportedTotal = payments.reduce(
          (s, x, i) =>
            s +
            (eligibilityVerified[i] && rateVerified[i] && sourceCurrent[i]
              ? x
              : 0),
          0,
        );
      return {
        paymentTotal,
        supportedTotal,
        share: paymentTotal > 0 ? supportedTotal / paymentTotal : 0,
        defined: paymentTotal > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    payments: [2, 3, 5],
    eligibilityVerified: [true, true, true],
    rateVerified: [true, true, false],
    sourceCurrent: [true, false, true],
  },
  output: { paymentTotal: 10, supportedTotal: 2, share: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const farmPaymentSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/farm-payment-support-share",
    title: "Farm Payment Support Share Tool",
    description:
      "Calculate farm payment support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        payments: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        eligibilityVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        rateVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        sourceCurrent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "payments",
        "eligibilityVerified",
        "rateVerified",
        "sourceCurrent",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        paymentTotal: { type: "number" },
        supportedTotal: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["paymentTotal", "supportedTotal", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "payments",
          label: "Payments",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "eligibilityVerified",
          label: "Eligibility Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "rateVerified",
          label: "Rate Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sourceCurrent",
          label: "Source Current",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "paymentTotal",
          label: "Payment Total",
          valueType: { type: "number" },
        },
        {
          id: "supportedTotal",
          label: "Supported Total",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = farmPaymentSupportShareTool.execute;
export default farmPaymentSupportShareTool;
