import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedDays: number;
  readonly referenceDays: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedDays: { type: "number", minimum: 0 },
    referenceDays: { type: "number", minimum: 0 },
  },
  required: ["suppliedDays", "referenceDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Compare explicit research gestational-day coordinates without dating a pregnancy or recommending care. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedDays, referenceDays } = request;
  const compute = (): Output => {
    H.domain(suppliedDays >= 0 && referenceDays >= 0);
    return { gap: suppliedDays - referenceDays };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedDays: 200, referenceDays: 196 },
  output: { gap: 4 },
} satisfies ToolExample<Input, Output>;
export const gestationalReferenceDayGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "obstetrics/gestational-reference-day-gap",
    title: "Gestational Reference Day Gap Tool",
    description:
      "Compare explicit research gestational-day coordinates without dating a pregnancy or recommending care.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedDays: { type: "number", minimum: 0 },
        referenceDays: { type: "number", minimum: 0 },
      },
      required: ["suppliedDays", "referenceDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedDays",
          label: "Supplied Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDays",
          label: "Reference Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = gestationalReferenceDayGapTool.execute;
export default gestationalReferenceDayGapTool;
