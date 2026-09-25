import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly warmHole: number;
  readonly warmShaft: number;
  readonly holeRetention: number;
  readonly shaftRetention: number;
};
export type Output = {
  readonly coldHole: number;
  readonly coldShaft: number;
  readonly clearance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    warmHole: { type: "number", minimum: 0 },
    warmShaft: { type: "number", minimum: 0 },
    holeRetention: { type: "number", exclusiveMinimum: 0 },
    shaftRetention: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["warmHole", "warmShaft", "holeRetention", "shaftRetention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coldHole: { type: "number" },
    coldShaft: { type: "number" },
    clearance: { type: "number" },
  },
  required: ["coldHole", "coldShaft", "clearance"],
} as const;
/** Use caller-supplied integrated linear retention factors for two parts at their explicit cold conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { warmHole, warmShaft, holeRetention, shaftRetention } = request;
  const compute = (): Output => {
    H.domain(
      warmHole >= 0 &&
        warmShaft >= 0 &&
        holeRetention > 0 &&
        shaftRetention > 0,
    );
    return {
      coldHole: warmHole * holeRetention,
      coldShaft: warmShaft * shaftRetention,
      clearance: warmHole * holeRetention - warmShaft * shaftRetention,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    warmHole: 10,
    warmShaft: 9.9,
    holeRetention: 0.99,
    shaftRetention: 0.98,
  },
  output: { coldHole: 9.9, coldShaft: 9.702, clearance: 0.1980000000000004 },
} satisfies ToolExample<Input, Output>;
export const cryostatWarmColdContractionClearanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cryogenics/cryostat-warm-cold-contraction-clearance",
      title: "Cryostat Warm Cold Contraction Clearance Tool",
      description:
        "Use caller-supplied integrated linear retention factors for two parts at their explicit cold conditions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          warmHole: { type: "number", minimum: 0 },
          warmShaft: { type: "number", minimum: 0 },
          holeRetention: { type: "number", exclusiveMinimum: 0 },
          shaftRetention: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["warmHole", "warmShaft", "holeRetention", "shaftRetention"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coldHole: { type: "number" },
          coldShaft: { type: "number" },
          clearance: { type: "number" },
        },
        required: ["coldHole", "coldShaft", "clearance"],
      },
      ports: {
        inputs: [
          {
            id: "warmHole",
            label: "Warm Hole",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "warmShaft",
            label: "Warm Shaft",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "holeRetention",
            label: "Hole Retention",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "shaftRetention",
            label: "Shaft Retention",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "coldHole", label: "Cold Hole", valueType: { type: "number" } },
          {
            id: "coldShaft",
            label: "Cold Shaft",
            valueType: { type: "number" },
          },
          {
            id: "clearance",
            label: "Clearance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cryostatWarmColdContractionClearanceTool.execute;
export default cryostatWarmColdContractionClearanceTool;
