import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signedFlows: readonly number[];
  readonly accountLabels: readonly string[];
  readonly selectedAccount: string;
};
export type Output = {
  readonly grossAbsoluteFlow: number;
  readonly selectedSignedFlow: number;
  readonly signedShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedFlows: { type: "array", maxItems: 256, items: { type: "number" } },
    accountLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    selectedAccount: { type: "string", maxLength: 8192 },
  },
  required: ["signedFlows", "accountLabels", "selectedAccount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossAbsoluteFlow: { type: "number" },
    selectedSignedFlow: { type: "number" },
    signedShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "grossAbsoluteFlow",
    "selectedSignedFlow",
    "signedShare",
    "defined",
  ],
} as const;
/** Calculate external account flow share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedFlows, accountLabels, selectedAccount } = request;
  const compute = (): Output => {
    H.sameLength(signedFlows, accountLabels);
    return (() => {
      const grossAbsoluteFlow = signedFlows.reduce(
          (s, x) => s + Math.abs(x),
          0,
        ),
        selectedSignedFlow = signedFlows.reduce(
          (s, x, i) => s + (accountLabels[i] === selectedAccount ? x : 0),
          0,
        );
      return {
        grossAbsoluteFlow,
        selectedSignedFlow,
        signedShare:
          grossAbsoluteFlow > 0 ? selectedSignedFlow / grossAbsoluteFlow : 0,
        defined: grossAbsoluteFlow > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    signedFlows: [10, -5, 5],
    accountLabels: ["A", "A", "B"],
    selectedAccount: "A",
  },
  output: {
    grossAbsoluteFlow: 20,
    selectedSignedFlow: 5,
    signedShare: 0.25,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const externalAccountFlowShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/external-account-flow-share",
    title: "External Account Flow Share Tool",
    description:
      "Calculate external account flow share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedFlows: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        accountLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        selectedAccount: { type: "string", maxLength: 8192 },
      },
      required: ["signedFlows", "accountLabels", "selectedAccount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossAbsoluteFlow: { type: "number" },
        selectedSignedFlow: { type: "number" },
        signedShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "grossAbsoluteFlow",
        "selectedSignedFlow",
        "signedShare",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "signedFlows",
          label: "Signed Flows",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "accountLabels",
          label: "Account Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "selectedAccount",
          label: "Selected Account",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "grossAbsoluteFlow",
          label: "Gross Absolute Flow",
          valueType: { type: "number" },
        },
        {
          id: "selectedSignedFlow",
          label: "Selected Signed Flow",
          valueType: { type: "number" },
        },
        {
          id: "signedShare",
          label: "Signed Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = externalAccountFlowShareTool.execute;
export default externalAccountFlowShareTool;
