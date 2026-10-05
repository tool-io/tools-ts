import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly portName: string;
  readonly unitWording: string;
  readonly ledgerId: string;
};
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    portName: { type: "string", maxLength: 8192 },
    unitWording: { type: "string", maxLength: 8192 },
    ledgerId: { type: "string", maxLength: 8192 },
  },
  required: ["portName", "unitWording", "ledgerId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Scope historical ledger-unit wording by port and source rather than inventing a fixed unit conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { portName, unitWording, ledgerId } = request;
  const compute = (): Output => {
    H.domain(
      portName.length > 0 && unitWording.length > 0 && ledgerId.length > 0,
      "portName",
    );
    return { key: JSON.stringify([portName, unitWording, ledgerId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { portName: "Port A", unitWording: "barrel", ledgerId: "L17" },
  output: { key: '["Port A","barrel","L17"]' },
} satisfies ToolExample<Input, Output>;
export const caribbeanPortLedgerUnitKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "latin-american-studies/caribbean-port-ledger-unit-key",
    title: "Caribbean Port Ledger Unit Key Tool",
    description:
      "Scope historical ledger-unit wording by port and source rather than inventing a fixed unit conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        portName: { type: "string", maxLength: 8192 },
        unitWording: { type: "string", maxLength: 8192 },
        ledgerId: { type: "string", maxLength: 8192 },
      },
      required: ["portName", "unitWording", "ledgerId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { key: { type: "string", maxLength: 8192 } },
      required: ["key"],
    },
    ports: {
      inputs: [
        {
          id: "portName",
          label: "Port Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unitWording",
          label: "Unit Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ledgerId",
          label: "Ledger Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = caribbeanPortLedgerUnitKeyTool.execute;
export default caribbeanPortLedgerUnitKeyTool;
