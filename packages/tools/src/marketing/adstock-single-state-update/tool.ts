import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousState: number;
  readonly currentSpend: number;
  readonly suppliedRetentionFraction: number;
};
export type Output = { readonly updatedState: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousState: { type: "number", minimum: 0 },
    currentSpend: { type: "number", minimum: 0 },
    suppliedRetentionFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["previousState", "currentSpend", "suppliedRetentionFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { updatedState: { type: "number" } },
  required: ["updatedState"],
} as const;
/** Update one explicit unnormalized geometric adstock state using supplied retention and current spend without fitting a response model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousState, currentSpend, suppliedRetentionFraction } = request;
  const compute = (): Output => {
    H.domain(previousState >= 0 && currentSpend >= 0, "previousState");
    (H.domain(
      suppliedRetentionFraction >= 0 && suppliedRetentionFraction <= 1,
      "suppliedRetentionFraction",
    ),
      suppliedRetentionFraction);
    return {
      updatedState: currentSpend + suppliedRetentionFraction * previousState,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousState: 100,
    currentSpend: 40,
    suppliedRetentionFraction: 0.5,
  },
  output: { updatedState: 90 },
} satisfies ToolExample<Input, Output>;
export const adstockSingleStateUpdateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["marketing", "business and finance"],
      keywords: ["marketing", "business and finance"],
    },
    id: "marketing/adstock-single-state-update",
    title: "Adstock Single State Update",
    description:
      "Update one explicit unnormalized geometric adstock state using supplied retention and current spend without fitting a response model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousState: { type: "number", minimum: 0 },
        currentSpend: { type: "number", minimum: 0 },
        suppliedRetentionFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["previousState", "currentSpend", "suppliedRetentionFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { updatedState: { type: "number" } },
      required: ["updatedState"],
    },
    ports: {
      inputs: [
        {
          id: "previousState",
          label: "Previous State",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentSpend",
          label: "Current Spend",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRetentionFraction",
          label: "Supplied Retention Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "updatedState",
          label: "Updated State",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = adstockSingleStateUpdateTool.execute;
export default adstockSingleStateUpdateTool;
