import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredExhibits: readonly string[];
  readonly disclosedExhibits: readonly string[];
  readonly withdrawnExhibits: readonly string[];
};
export type Output = {
  readonly eligibleExhibits: number;
  readonly coveredExhibits: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredExhibits: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    disclosedExhibits: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    withdrawnExhibits: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredExhibits", "disclosedExhibits", "withdrawnExhibits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleExhibits: { type: "integer" },
    coveredExhibits: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["eligibleExhibits", "coveredExhibits", "share", "defined"],
} as const;
/** Count explicit public exhibit inventory coverage; no disclosure-law determination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredExhibits, disclosedExhibits, withdrawnExhibits } = request;
  const compute = (): Output => {
    return (() => {
      const eligible = [...new Set(requiredExhibits)].filter(
          (x) => !withdrawnExhibits.includes(x),
        ),
        coveredExhibits = eligible.filter((x) =>
          disclosedExhibits.includes(x),
        ).length;
      return {
        eligibleExhibits: eligible.length,
        coveredExhibits,
        share: eligible.length > 0 ? coveredExhibits / eligible.length : 0,
        defined: eligible.length > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredExhibits: ["A", "B", "C"],
    disclosedExhibits: ["A"],
    withdrawnExhibits: ["C"],
  },
  output: {
    eligibleExhibits: 2,
    coveredExhibits: 1,
    share: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const disclosedExhibitCoverageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "criminal-justice/disclosed-exhibit-coverage-share",
    title: "Disclosed Exhibit Coverage Share Tool",
    description:
      "Count explicit public exhibit inventory coverage; no disclosure-law determination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredExhibits: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        disclosedExhibits: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        withdrawnExhibits: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredExhibits", "disclosedExhibits", "withdrawnExhibits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleExhibits: { type: "integer" },
        coveredExhibits: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["eligibleExhibits", "coveredExhibits", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "requiredExhibits",
          label: "Required Exhibits",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "disclosedExhibits",
          label: "Disclosed Exhibits",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "withdrawnExhibits",
          label: "Withdrawn Exhibits",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "eligibleExhibits",
          label: "Eligible Exhibits",
          valueType: { type: "integer" },
        },
        {
          id: "coveredExhibits",
          label: "Covered Exhibits",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = disclosedExhibitCoverageShareTool.execute;
export default disclosedExhibitCoverageShareTool;
