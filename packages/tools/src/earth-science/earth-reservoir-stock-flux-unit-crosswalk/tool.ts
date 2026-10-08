import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stock: number;
  readonly flowPerSourceTime: number;
  readonly targetTimePerSourceTime: number;
};
export type Output = {
  readonly flowPerTargetTime: number;
  readonly residenceTargetTimes: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stock: { type: "number", minimum: 0 },
    flowPerSourceTime: { type: "number", minimum: 0 },
    targetTimePerSourceTime: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["stock", "flowPerSourceTime", "targetTimePerSourceTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowPerTargetTime: { type: "number" },
    residenceTargetTimes: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["flowPerTargetTime", "residenceTargetTimes", "defined"],
} as const;
/** Crosswalk an explicit reservoir flow time basis and stock/flow residence ratio without assuming physical mixing behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stock, flowPerSourceTime, targetTimePerSourceTime } = request;
  const compute = (): Output => {
    H.domain(stock >= 0 && flowPerSourceTime >= 0, "stock");
    (H.domain(targetTimePerSourceTime > 0, "targetTimePerSourceTime"),
      targetTimePerSourceTime);
    return (() => {
      const flowPerTargetTime = flowPerSourceTime / targetTimePerSourceTime;
      return {
        flowPerTargetTime,
        residenceTargetTimes:
          flowPerTargetTime > 0 ? stock / flowPerTargetTime : 0,
        defined: flowPerTargetTime > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stock: 100, flowPerSourceTime: 20, targetTimePerSourceTime: 10 },
  output: { flowPerTargetTime: 2, residenceTargetTimes: 50, defined: true },
} satisfies ToolExample<Input, Output>;
export const earthReservoirStockFluxUnitCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "earth-science",
          "earth science",
          "earth and environmental sciences",
        ],
        keywords: ["earth science", "earth and environmental sciences"],
      },
      id: "earth-science/earth-reservoir-stock-flux-unit-crosswalk",
      title: "Earth Reservoir Stock Flux Unit Crosswalk",
      description:
        "Crosswalk an explicit reservoir flow time basis and stock/flow residence ratio without assuming physical mixing behavior.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stock: { type: "number", minimum: 0 },
          flowPerSourceTime: { type: "number", minimum: 0 },
          targetTimePerSourceTime: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["stock", "flowPerSourceTime", "targetTimePerSourceTime"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          flowPerTargetTime: { type: "number" },
          residenceTargetTimes: { type: "number" },
          defined: { type: "boolean" },
        },
        required: ["flowPerTargetTime", "residenceTargetTimes", "defined"],
      },
      ports: {
        inputs: [
          {
            id: "stock",
            label: "Stock",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "flowPerSourceTime",
            label: "Flow Per Source Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetTimePerSourceTime",
            label: "Target Time Per Source Time",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "flowPerTargetTime",
            label: "Flow Per Target Time",
            valueType: { type: "number" },
          },
          {
            id: "residenceTargetTimes",
            label: "Residence Target Times",
            valueType: { type: "number" },
          },
          { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = earthReservoirStockFluxUnitCrosswalkTool.execute;
export default earthReservoirStockFluxUnitCrosswalkTool;
