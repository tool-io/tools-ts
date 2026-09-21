import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly proposed: number;
  readonly agreed: number;
  readonly sourceToAgreedFactor: number;
};
export type Output = {
  readonly convertedProposal: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    proposed: { type: "number", minimum: 0 },
    agreed: { type: "number", minimum: 0 },
    sourceToAgreedFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["proposed", "agreed", "sourceToAgreedFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedProposal: { type: "number" },
    gap: { type: "number" },
  },
  required: ["convertedProposal", "gap"],
} as const;
/** Calculate negotiated credit unit gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { proposed, agreed, sourceToAgreedFactor } = request;
  const compute = (): Output => {
    H.domain(proposed >= 0 && agreed >= 0);
    H.positive(sourceToAgreedFactor);
    return {
      convertedProposal: proposed * sourceToAgreedFactor,
      gap: agreed - proposed * sourceToAgreedFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { proposed: 3, agreed: 5, sourceToAgreedFactor: 2 },
  output: { convertedProposal: 6, gap: -1 },
} satisfies ToolExample<Input, Output>;
export const negotiatedCreditUnitGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "andragogy/negotiated-credit-unit-gap",
    title: "Negotiated Credit Unit Gap Tool",
    description:
      "Calculate negotiated credit unit gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        proposed: { type: "number", minimum: 0 },
        agreed: { type: "number", minimum: 0 },
        sourceToAgreedFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["proposed", "agreed", "sourceToAgreedFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedProposal: { type: "number" },
        gap: { type: "number" },
      },
      required: ["convertedProposal", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "proposed",
          label: "Proposed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "agreed",
          label: "Agreed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceToAgreedFactor",
          label: "Source To Agreed Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedProposal",
          label: "Converted Proposal",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = negotiatedCreditUnitGapTool.execute;
export default negotiatedCreditUnitGapTool;
