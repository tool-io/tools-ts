import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly versionCodes: readonly string[];
  readonly effectiveDates: readonly string[];
  readonly asOfDate: string;
};
export type Output = {
  readonly found: boolean;
  readonly versionCode: string;
  readonly effectiveDate: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    versionCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    effectiveDates: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["versionCodes", "effectiveDates", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    found: { type: "boolean" },
    versionCode: { type: "string", maxLength: 8192 },
    effectiveDate: { type: "string", maxLength: 8192 },
  },
  required: ["found", "versionCode", "effectiveDate"],
} as const;
/** Select the latest not-future policy version from explicit unique effective dates without applying repeal, supersession or jurisdiction rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { versionCodes, effectiveDates, asOfDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(versionCodes.length === effectiveDates.length, "effectiveDates");
    H.domain(
      new Set(effectiveDates).size === effectiveDates.length,
      "effectiveDates",
    );
    const cutoff = namedDate(asOfDate, "asOfDate").getTime(),
      times = effectiveDates.map((v) =>
        namedDate(v, "effectiveDates").getTime(),
      );
    let index = -1;
    times.forEach((v, i) => {
      if (v <= cutoff && (index < 0 || v > times[index])) index = i;
    });
    return {
      found: index >= 0,
      versionCode: index < 0 ? "" : versionCodes[index],
      effectiveDate: index < 0 ? "" : effectiveDates[index],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    versionCodes: ["v1", "v2"],
    effectiveDates: ["2025-01-01", "2026-10-01"],
    asOfDate: "2026-11-01",
  },
  output: { found: true, versionCode: "v2", effectiveDate: "2026-10-01" },
} satisfies ToolExample<Input, Output>;
export const policyVersionEffectiveDateChoiceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/policy-version-effective-date-choice",
    title: "Policy Version Effective Date Choice",
    description:
      "Select the latest not-future policy version from explicit unique effective dates without applying repeal, supersession or jurisdiction rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        versionCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        effectiveDates: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["versionCodes", "effectiveDates", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        found: { type: "boolean" },
        versionCode: { type: "string", maxLength: 8192 },
        effectiveDate: { type: "string", maxLength: 8192 },
      },
      required: ["found", "versionCode", "effectiveDate"],
    },
    ports: {
      inputs: [
        {
          id: "versionCodes",
          label: "Version Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "effectiveDates",
          label: "Effective Dates",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "found", label: "Found", valueType: { type: "boolean" } },
        {
          id: "versionCode",
          label: "Version Code",
          valueType: { type: "string" },
        },
        {
          id: "effectiveDate",
          label: "Effective Date",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = policyVersionEffectiveDateChoiceTool.execute;
export default policyVersionEffectiveDateChoiceTool;
