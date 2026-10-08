import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseMinutes: number;
  readonly suppliedExtraFraction: number;
  readonly fixedExtraMinutes: number;
};
export type Output = {
  readonly extraMinutes: number;
  readonly allowedMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseMinutes: { type: "number", minimum: 0 },
    suppliedExtraFraction: { type: "number", minimum: 0 },
    fixedExtraMinutes: { type: "number", minimum: 0 },
  },
  required: ["baseMinutes", "suppliedExtraFraction", "fixedExtraMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extraMinutes: { type: "number" },
    allowedMinutes: { type: "number" },
  },
  required: ["extraMinutes", "allowedMinutes"],
} as const;
/** Combine explicit proportional and fixed examination extensions without choosing accommodations or eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseMinutes, suppliedExtraFraction, fixedExtraMinutes } = request;
  const compute = (): Output => {
    H.domain(
      baseMinutes >= 0 && suppliedExtraFraction >= 0 && fixedExtraMinutes >= 0,
      "baseMinutes",
    );
    return {
      extraMinutes: baseMinutes * suppliedExtraFraction + fixedExtraMinutes,
      allowedMinutes:
        baseMinutes * (1 + suppliedExtraFraction) + fixedExtraMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baseMinutes: 60,
    suppliedExtraFraction: 0.25,
    fixedExtraMinutes: 10,
  },
  output: { extraMinutes: 25, allowedMinutes: 85 },
} satisfies ToolExample<Input, Output>;
export const examinationExtraTimeFixedExtensionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["education"],
      keywords: ["education"],
    },
    id: "education/examination-extra-time-fixed-extension",
    title: "Examination Extra Time Fixed Extension",
    description:
      "Combine explicit proportional and fixed examination extensions without choosing accommodations or eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseMinutes: { type: "number", minimum: 0 },
        suppliedExtraFraction: { type: "number", minimum: 0 },
        fixedExtraMinutes: { type: "number", minimum: 0 },
      },
      required: ["baseMinutes", "suppliedExtraFraction", "fixedExtraMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        extraMinutes: { type: "number" },
        allowedMinutes: { type: "number" },
      },
      required: ["extraMinutes", "allowedMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "baseMinutes",
          label: "Base Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedExtraFraction",
          label: "Supplied Extra Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedExtraMinutes",
          label: "Fixed Extra Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "extraMinutes",
          label: "Extra Minutes",
          valueType: { type: "number" },
        },
        {
          id: "allowedMinutes",
          label: "Allowed Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = examinationExtraTimeFixedExtensionTool.execute;
export default examinationExtraTimeFixedExtensionTool;
