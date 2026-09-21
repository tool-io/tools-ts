import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly heads: number;
  readonly saleValue: number;
  readonly perHead: number;
  readonly percentRate: number;
  readonly mode: string;
};
export type Output = {
  readonly commission: number;
  readonly effectivePerHead: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heads: { type: "integer", minimum: 1 },
    saleValue: { type: "number", minimum: 0 },
    perHead: { type: "number", minimum: 0 },
    percentRate: { type: "number", minimum: 0, maximum: 1 },
    mode: { type: "string", maxLength: 8192, enum: ["per-head", "percent"] },
  },
  required: ["heads", "saleValue", "perHead", "percentRate", "mode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commission: { type: "number" },
    effectivePerHead: { type: "number" },
  },
  required: ["commission", "effectivePerHead"],
} as const;
/** Calculate livestock commission perhead percent choice from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { heads, saleValue, perHead, percentRate, mode } = request;
  const compute = (): Output => {
    H.integer(heads, 1);
    H.domain(saleValue >= 0 && perHead >= 0);
    H.probability(percentRate);
    H.domain(["per-head", "percent"].includes(mode));
    return {
      commission:
        mode === "per-head" ? heads * perHead : saleValue * percentRate,
      effectivePerHead:
        (mode === "per-head" ? heads * perHead : saleValue * percentRate) /
        heads,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    heads: 10,
    saleValue: 5000,
    perHead: 20,
    percentRate: 0.05,
    mode: "per-head",
  },
  output: { commission: 200, effectivePerHead: 20 },
} satisfies ToolExample<Input, Output>;
export const livestockCommissionPerheadPercentChoiceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agribusiness/livestock-commission-perhead-percent-choice",
      title: "Livestock Commission Perhead Percent Choice Tool",
      description:
        "Calculate livestock commission perhead percent choice from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          heads: { type: "integer", minimum: 1 },
          saleValue: { type: "number", minimum: 0 },
          perHead: { type: "number", minimum: 0 },
          percentRate: { type: "number", minimum: 0, maximum: 1 },
          mode: {
            type: "string",
            maxLength: 8192,
            enum: ["per-head", "percent"],
          },
        },
        required: ["heads", "saleValue", "perHead", "percentRate", "mode"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          commission: { type: "number" },
          effectivePerHead: { type: "number" },
        },
        required: ["commission", "effectivePerHead"],
      },
      ports: {
        inputs: [
          {
            id: "heads",
            label: "Heads",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "saleValue",
            label: "Sale Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "perHead",
            label: "Per Head",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "percentRate",
            label: "Percent Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "mode",
            label: "Mode",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "commission",
            label: "Commission",
            valueType: { type: "number" },
          },
          {
            id: "effectivePerHead",
            label: "Effective Per Head",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = livestockCommissionPerheadPercentChoiceTool.execute;
export default livestockCommissionPerheadPercentChoiceTool;
