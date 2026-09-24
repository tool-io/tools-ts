import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: string;
  readonly levels: readonly string[];
  readonly stratumCodes: readonly string[];
};
export type Output = { readonly code: string; readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "string", maxLength: 8192 },
    levels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    stratumCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["value", "levels", "stratumCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", maxLength: 8192 },
    index: { type: "integer" },
  },
  required: ["code", "index"],
} as const;
/** Map one supplied stratification factor to its explicit code. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, levels, stratumCodes } = request;
  const compute = (): Output => {
    H.sameLength(levels, stratumCodes);
    H.domain(new Set(levels).size === levels.length);
    const index = levels.indexOf(value);
    H.domain(index >= 0, "value");
    return { code: stratumCodes[index], index };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: "B", levels: ["A", "B"], stratumCodes: ["S1", "S2"] },
  output: { code: "S2", index: 1 },
} satisfies ToolExample<Input, Output>;
export const trialStratificationOneFactorCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/trial-stratification-one-factor-code",
    title: "Trial Stratification One Factor Code Tool",
    description: "Map one supplied stratification factor to its explicit code.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "string", maxLength: 8192 },
        levels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        stratumCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["value", "levels", "stratumCodes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        code: { type: "string", maxLength: 8192 },
        index: { type: "integer" },
      },
      required: ["code", "index"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "levels",
          label: "Levels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "stratumCodes",
          label: "Stratum Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "code", label: "Code", valueType: { type: "string" } },
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = trialStratificationOneFactorCodeTool.execute;
export default trialStratificationOneFactorCodeTool;
