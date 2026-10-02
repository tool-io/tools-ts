import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priorEnd: number;
  readonly nextStart: number;
  readonly suppliedCarryCap: number;
};
export type Output = {
  readonly overlap: number;
  readonly carriedDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priorEnd: { type: "number" },
    nextStart: { type: "number" },
    suppliedCarryCap: { type: "number", minimum: 0 },
  },
  required: ["priorEnd", "nextStart", "suppliedCarryCap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlap: { type: "number" },
    carriedDuration: { type: "number" },
  },
  required: ["overlap", "carriedDuration"],
} as const;
/** Apply an explicit stockpile duration cap to deidentified exposure-record overlap without inferring medicine use. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priorEnd, nextStart, suppliedCarryCap } = request;
  const compute = (): Output => {
    H.domain(suppliedCarryCap >= 0);
    return {
      overlap: Math.max(0, priorEnd - nextStart),
      carriedDuration: Math.min(
        suppliedCarryCap,
        Math.max(0, priorEnd - nextStart),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { priorEnd: 20, nextStart: 15, suppliedCarryCap: 3 },
  output: { overlap: 5, carriedDuration: 3 },
} satisfies ToolExample<Input, Output>;
export const exposureOverlapStockpileTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacoepidemiology/exposure-overlap-stockpile-term",
    title: "Exposure Overlap Stockpile Term Tool",
    description:
      "Apply an explicit stockpile duration cap to deidentified exposure-record overlap without inferring medicine use.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priorEnd: { type: "number" },
        nextStart: { type: "number" },
        suppliedCarryCap: { type: "number", minimum: 0 },
      },
      required: ["priorEnd", "nextStart", "suppliedCarryCap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlap: { type: "number" },
        carriedDuration: { type: "number" },
      },
      required: ["overlap", "carriedDuration"],
    },
    ports: {
      inputs: [
        {
          id: "priorEnd",
          label: "Prior End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextStart",
          label: "Next Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCarryCap",
          label: "Supplied Carry Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
        {
          id: "carriedDuration",
          label: "Carried Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exposureOverlapStockpileTermTool.execute;
export default exposureOverlapStockpileTermTool;
