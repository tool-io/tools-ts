import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly existingShares: number;
  readonly additionalShares: number;
};
export type Output = {
  readonly postIssueShares: number;
  readonly retainedOwnershipFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    existingShares: { type: "number", exclusiveMinimum: 0 },
    additionalShares: { type: "number", minimum: 0 },
  },
  required: ["existingShares", "additionalShares"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    postIssueShares: { type: "number" },
    retainedOwnershipFactor: { type: "number" },
  },
  required: ["postIssueShares", "retainedOwnershipFactor"],
} as const;
/** Calculate dilution instrument share factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { existingShares, additionalShares } = request;
  const compute = (): Output => {
    H.positive(existingShares);
    H.domain(additionalShares >= 0);
    return {
      postIssueShares: existingShares + additionalShares,
      retainedOwnershipFactor:
        existingShares / (existingShares + additionalShares),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { existingShares: 100, additionalShares: 25 },
  output: { postIssueShares: 125, retainedOwnershipFactor: 0.8 },
} satisfies ToolExample<Input, Output>;
export const dilutionInstrumentShareFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "corporate-finance/dilution-instrument-share-factor",
    title: "Dilution Instrument Share Factor Tool",
    description:
      "Calculate dilution instrument share factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        existingShares: { type: "number", exclusiveMinimum: 0 },
        additionalShares: { type: "number", minimum: 0 },
      },
      required: ["existingShares", "additionalShares"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        postIssueShares: { type: "number" },
        retainedOwnershipFactor: { type: "number" },
      },
      required: ["postIssueShares", "retainedOwnershipFactor"],
    },
    ports: {
      inputs: [
        {
          id: "existingShares",
          label: "Existing Shares",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "additionalShares",
          label: "Additional Shares",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "postIssueShares",
          label: "Post Issue Shares",
          valueType: { type: "number" },
        },
        {
          id: "retainedOwnershipFactor",
          label: "Retained Ownership Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dilutionInstrumentShareFactorTool.execute;
export default dilutionInstrumentShareFactorTool;
