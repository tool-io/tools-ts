import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedSuccess: number;
  readonly observedTotal: number;
  readonly missing: number;
  readonly lowerMissingRate: number;
  readonly upperMissingRate: number;
};
export type Output = { readonly lowerRate: number; readonly upperRate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedSuccess: { type: "integer", minimum: 0 },
    observedTotal: { type: "integer", minimum: 1 },
    missing: { type: "integer", minimum: 0 },
    lowerMissingRate: { type: "number", minimum: 0, maximum: 1 },
    upperMissingRate: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "observedSuccess",
    "observedTotal",
    "missing",
    "lowerMissingRate",
    "upperMissingRate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lowerRate: { type: "number" }, upperRate: { type: "number" } },
  required: ["lowerRate", "upperRate"],
} as const;
/** Calculate acupuncture evidence missing outcome bound from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    observedSuccess,
    observedTotal,
    missing,
    lowerMissingRate,
    upperMissingRate,
  } = request;
  const compute = (): Output => {
    H.integer(observedTotal, 1);
    H.integer(observedSuccess, 0, observedTotal);
    H.integer(missing, 0);
    H.probability(lowerMissingRate);
    H.probability(upperMissingRate);
    H.domain(upperMissingRate >= lowerMissingRate);
    return {
      lowerRate:
        (observedSuccess + missing * lowerMissingRate) /
        (observedTotal + missing),
      upperRate:
        (observedSuccess + missing * upperMissingRate) /
        (observedTotal + missing),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedSuccess: 30,
    observedTotal: 80,
    missing: 20,
    lowerMissingRate: 0,
    upperMissingRate: 1,
  },
  output: { lowerRate: 0.3, upperRate: 0.5 },
} satisfies ToolExample<Input, Output>;
export const acupunctureEvidenceMissingOutcomeBoundTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "acupuncture/acupuncture-evidence-missing-outcome-bound",
      title: "Acupuncture Evidence Missing Outcome Bound Tool",
      description:
        "Calculate acupuncture evidence missing outcome bound from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedSuccess: { type: "integer", minimum: 0 },
          observedTotal: { type: "integer", minimum: 1 },
          missing: { type: "integer", minimum: 0 },
          lowerMissingRate: { type: "number", minimum: 0, maximum: 1 },
          upperMissingRate: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "observedSuccess",
          "observedTotal",
          "missing",
          "lowerMissingRate",
          "upperMissingRate",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowerRate: { type: "number" },
          upperRate: { type: "number" },
        },
        required: ["lowerRate", "upperRate"],
      },
      ports: {
        inputs: [
          {
            id: "observedSuccess",
            label: "Observed Success",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "observedTotal",
            label: "Observed Total",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "missing",
            label: "Missing",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "lowerMissingRate",
            label: "Lower Missing Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperMissingRate",
            label: "Upper Missing Rate",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "lowerRate",
            label: "Lower Rate",
            valueType: { type: "number" },
          },
          {
            id: "upperRate",
            label: "Upper Rate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = acupunctureEvidenceMissingOutcomeBoundTool.execute;
export default acupunctureEvidenceMissingOutcomeBoundTool;
