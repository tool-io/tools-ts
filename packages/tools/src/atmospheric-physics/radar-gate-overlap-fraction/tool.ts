import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gateStart: number;
  readonly gateEnd: number;
  readonly targetStart: number;
  readonly targetEnd: number;
};
export type Output = {
  readonly overlap: number;
  readonly gateFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gateStart: { type: "number" },
    gateEnd: { type: "number" },
    targetStart: { type: "number" },
    targetEnd: { type: "number" },
  },
  required: ["gateStart", "gateEnd", "targetStart", "targetEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlap: { type: "number" }, gateFraction: { type: "number" } },
  required: ["overlap", "gateFraction"],
} as const;
/** Calculate radar gate overlap fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gateStart, gateEnd, targetStart, targetEnd } = request;
  const compute = (): Output => {
    H.domain(gateEnd > gateStart && targetEnd >= targetStart);
    return {
      overlap: Math.max(
        0,
        Math.min(gateEnd, targetEnd) - Math.max(gateStart, targetStart),
      ),
      gateFraction:
        Math.max(
          0,
          Math.min(gateEnd, targetEnd) - Math.max(gateStart, targetStart),
        ) /
        (gateEnd - gateStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gateStart: 0, gateEnd: 100, targetStart: 50, targetEnd: 150 },
  output: { overlap: 50, gateFraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const radarGateOverlapFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/radar-gate-overlap-fraction",
    title: "Radar Gate Overlap Fraction Tool",
    description:
      "Calculate radar gate overlap fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gateStart: { type: "number" },
        gateEnd: { type: "number" },
        targetStart: { type: "number" },
        targetEnd: { type: "number" },
      },
      required: ["gateStart", "gateEnd", "targetStart", "targetEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlap: { type: "number" },
        gateFraction: { type: "number" },
      },
      required: ["overlap", "gateFraction"],
    },
    ports: {
      inputs: [
        {
          id: "gateStart",
          label: "Gate Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gateEnd",
          label: "Gate End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetStart",
          label: "Target Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetEnd",
          label: "Target End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
        {
          id: "gateFraction",
          label: "Gate Fraction",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = radarGateOverlapFractionTool.execute;
export default radarGateOverlapFractionTool;
