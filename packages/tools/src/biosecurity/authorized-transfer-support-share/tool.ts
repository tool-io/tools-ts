import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly benignItemCounts: readonly number[];
  readonly authorized: readonly boolean[];
  readonly chainRecorded: readonly boolean[];
  readonly destinationVerified: readonly boolean[];
};
export type Output = {
  readonly recordedDecimal: string;
  readonly supportedDecimal: string;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    benignItemCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    authorized: { type: "array", maxItems: 256, items: { type: "boolean" } },
    chainRecorded: { type: "array", maxItems: 256, items: { type: "boolean" } },
    destinationVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "benignItemCounts",
    "authorized",
    "chainRecorded",
    "destinationVerified",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    supportedDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["recordedDecimal", "supportedDecimal", "share", "defined"],
} as const;
/** Account for explicit authorized transfers of benign inventory under supplied record flags; no transport procedure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { benignItemCounts, authorized, chainRecorded, destinationVerified } =
    request;
  const compute = (): Output => {
    H.sameLength(benignItemCounts, authorized);
    H.sameLength(benignItemCounts, chainRecorded);
    H.sameLength(benignItemCounts, destinationVerified);
    H.domain(benignItemCounts.every((x) => x >= 0));
    return (() => {
      const a = benignItemCounts.reduce((s, x) => s + BigInt(x), 0n),
        b = benignItemCounts.reduce(
          (s, x, i) =>
            s +
            (authorized[i] && chainRecorded[i] && destinationVerified[i]
              ? BigInt(x)
              : 0n),
          0n,
        );
      return {
        recordedDecimal: a.toString(),
        supportedDecimal: b.toString(),
        share: a > 0n ? Number(b) / Number(a) : 0,
        defined: a > 0n,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    benignItemCounts: [2, 3, 5],
    authorized: [true, true, true],
    chainRecorded: [true, true, false],
    destinationVerified: [true, false, true],
  },
  output: {
    recordedDecimal: "10",
    supportedDecimal: "2",
    share: 0.2,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const authorizedTransferSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosecurity/authorized-transfer-support-share",
    title: "Authorized Transfer Support Share Tool",
    description:
      "Account for explicit authorized transfers of benign inventory under supplied record flags; no transport procedure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        benignItemCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        authorized: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        chainRecorded: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        destinationVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "benignItemCounts",
        "authorized",
        "chainRecorded",
        "destinationVerified",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        supportedDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["recordedDecimal", "supportedDecimal", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "benignItemCounts",
          label: "Benign Item Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "authorized",
          label: "Authorized",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "chainRecorded",
          label: "Chain Recorded",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "destinationVerified",
          label: "Destination Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "recordedDecimal",
          label: "Recorded Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "supportedDecimal",
          label: "Supported Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = authorizedTransferSupportShareTool.execute;
export default authorizedTransferSupportShareTool;
