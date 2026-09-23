import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sequence: string;
  readonly allowTerminal: boolean;
};
export type Output = {
  readonly valid: boolean;
  readonly terminalStop: boolean;
  readonly internalStop: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sequence: { type: "string", maxLength: 8192 },
    allowTerminal: { type: "boolean" },
  },
  required: ["sequence", "allowTerminal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "boolean" },
    terminalStop: { type: "boolean" },
    internalStop: { type: "boolean" },
  },
  required: ["valid", "terminalStop", "internalStop"],
} as const;
/** Check stop-symbol placement in an uppercase protein token; residue-alphabet validation beyond uppercase spelling is outside this policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sequence, allowTerminal } = request;
  const compute = (): Output => {
    H.domain(/^[A-Z*]*(?![\s\S])/.test(sequence));
    const terminalStop = sequence.endsWith("*"),
      internalStop = sequence
        .slice(0, terminalStop ? -1 : undefined)
        .includes("*");
    return {
      valid: !internalStop && (!terminalStop || allowTerminal),
      terminalStop,
      internalStop,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sequence: "MPEP*", allowTerminal: true },
  output: { valid: true, terminalStop: true, internalStop: false },
} satisfies ToolExample<Input, Output>;
export const proteinStopSymbolTerminalPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/protein-stop-symbol-terminal-policy",
    title: "Protein Stop Symbol Terminal Policy Tool",
    description:
      "Check stop-symbol placement in an uppercase protein token; residue-alphabet validation beyond uppercase spelling is outside this policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sequence: { type: "string", maxLength: 8192 },
        allowTerminal: { type: "boolean" },
      },
      required: ["sequence", "allowTerminal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valid: { type: "boolean" },
        terminalStop: { type: "boolean" },
        internalStop: { type: "boolean" },
      },
      required: ["valid", "terminalStop", "internalStop"],
    },
    ports: {
      inputs: [
        {
          id: "sequence",
          label: "Sequence",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowTerminal",
          label: "Allow Terminal",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        {
          id: "terminalStop",
          label: "Terminal Stop",
          valueType: { type: "boolean" },
        },
        {
          id: "internalStop",
          label: "Internal Stop",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = proteinStopSymbolTerminalPolicyTool.execute;
export default proteinStopSymbolTerminalPolicyTool;
