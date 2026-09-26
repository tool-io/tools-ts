import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { seriesCapacitorVoltageTool as pairVoltage } from "../../electronics/series-capacitor-voltage/tool.js";
export type Input = {
  readonly capacitances: readonly number[];
  readonly referenceIndex: number;
  readonly supplyVolts: number;
};
export type Output = {
  readonly voltageShare: number;
  readonly referenceVoltage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacitances: { type: "array", maxItems: 256, items: { type: "number" } },
    referenceIndex: { type: "integer", minimum: 0 },
    supplyVolts: { type: "number" },
  },
  required: ["capacitances", "referenceIndex", "supplyVolts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voltageShare: { type: "number" },
    referenceVoltage: { type: "number" },
  },
  required: ["voltageShare", "referenceVoltage"],
} as const;
/** Compute a selected ideal series-list capacitor voltage share under equal charge, reusing pair-voltage arithmetic after reciprocal scaling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacitances, referenceIndex, supplyVolts } = request;
  const compute = (): Output => {
    H.domain(capacitances.length > 0 && capacitances.every((x) => x > 0));
    H.integer(referenceIndex, 0, capacitances.length - 1);
    const minimum = Math.min(...capacitances),
      weights = capacitances.map((x) => minimum / x),
      selected = weights[referenceIndex],
      other = weights.reduce(
        (s, x, i) => s + (i === referenceIndex ? 0 : x),
        0,
      );
    let voltageShare: number;
    if (selected === 0) voltageShare = 0;
    else if (other === 0) voltageShare = 1;
    else {
      const result = pairVoltage.execute({
        supplyVolts: 1,
        c1: other,
        c2: selected,
      });
      if (!result.ok) throw new Error("Validated pair voltage failed.");
      voltageShare = result.output.voltageAcrossC1V;
    }
    return { voltageShare, referenceVoltage: supplyVolts * voltageShare };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capacitances: [2, 4, 4], referenceIndex: 0, supplyVolts: 12 },
  output: { voltageShare: 0.5, referenceVoltage: 6 },
} satisfies ToolExample<Input, Output>;
export const capacitorSeriesVoltageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/capacitor-series-voltage-share",
    title: "Capacitor Series Voltage Share Tool",
    description:
      "Compute a selected ideal series-list capacitor voltage share under equal charge, reusing pair-voltage arithmetic after reciprocal scaling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacitances: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        referenceIndex: { type: "integer", minimum: 0 },
        supplyVolts: { type: "number" },
      },
      required: ["capacitances", "referenceIndex", "supplyVolts"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voltageShare: { type: "number" },
        referenceVoltage: { type: "number" },
      },
      required: ["voltageShare", "referenceVoltage"],
    },
    ports: {
      inputs: [
        {
          id: "capacitances",
          label: "Capacitances",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceIndex",
          label: "Reference Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "supplyVolts",
          label: "Supply Volts",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "voltageShare",
          label: "Voltage Share",
          valueType: { type: "number" },
        },
        {
          id: "referenceVoltage",
          label: "Reference Voltage",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = capacitorSeriesVoltageShareTool.execute;
export default capacitorSeriesVoltageShareTool;
