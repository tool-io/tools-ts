import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalBerths: number;
  readonly reservedBerths: number;
  readonly unusableBerths: number;
};
export type Output = { readonly usableBerths: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalBerths: { type: "integer", minimum: 0 },
    reservedBerths: { type: "integer", minimum: 0 },
    unusableBerths: { type: "integer", minimum: 0 },
  },
  required: ["totalBerths", "reservedBerths", "unusableBerths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { usableBerths: { type: "integer" } },
  required: ["usableBerths"],
} as const;
/** Reconcile explicitly disjoint relief-tent berth exclusions without assessing shelter suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalBerths, reservedBerths, unusableBerths } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalBerths) &&
        totalBerths >= 0 &&
        totalBerths <= Number.MAX_SAFE_INTEGER,
      "totalBerths",
    ),
      totalBerths);
    (H.domain(
      Number.isSafeInteger(reservedBerths) &&
        reservedBerths >= 0 &&
        reservedBerths <= Number.MAX_SAFE_INTEGER,
      "reservedBerths",
    ),
      reservedBerths);
    (H.domain(
      Number.isSafeInteger(unusableBerths) &&
        unusableBerths >= 0 &&
        unusableBerths <= Number.MAX_SAFE_INTEGER,
      "unusableBerths",
    ),
      unusableBerths);
    return {
      usableBerths: Number(
        BigInt(totalBerths) - BigInt(reservedBerths) - BigInt(unusableBerths),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalBerths: 20, reservedBerths: 3, unusableBerths: 2 },
  output: { usableBerths: 15 },
} satisfies ToolExample<Input, Output>;
export const reliefTentUsableBerthCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["military-science", "military science", "social sciences"],
      keywords: ["military science", "social sciences"],
    },
    id: "military-science/relief-tent-usable-berth-count",
    title: "Relief Tent Usable Berth Count",
    description:
      "Reconcile explicitly disjoint relief-tent berth exclusions without assessing shelter suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalBerths: { type: "integer", minimum: 0 },
        reservedBerths: { type: "integer", minimum: 0 },
        unusableBerths: { type: "integer", minimum: 0 },
      },
      required: ["totalBerths", "reservedBerths", "unusableBerths"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { usableBerths: { type: "integer" } },
      required: ["usableBerths"],
    },
    ports: {
      inputs: [
        {
          id: "totalBerths",
          label: "Total Berths",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reservedBerths",
          label: "Reserved Berths",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unusableBerths",
          label: "Unusable Berths",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "usableBerths",
          label: "Usable Berths",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = reliefTentUsableBerthCountTool.execute;
export default reliefTentUsableBerthCountTool;
