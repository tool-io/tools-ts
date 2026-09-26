import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly rechargeDepth: number;
  readonly fractionReachingAquifer: number;
};
export type Output = { readonly rechargeVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    rechargeDepth: { type: "number", minimum: 0 },
    fractionReachingAquifer: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["area", "rechargeDepth", "fractionReachingAquifer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rechargeVolume: { type: "number" } },
  required: ["rechargeVolume"],
} as const;
/** Calculate groundwater recharge area depth volume from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, rechargeDepth, fractionReachingAquifer } = request;
  const compute = (): Output => {
    H.domain(area >= 0 && rechargeDepth >= 0);
    H.probability(fractionReachingAquifer);
    return { rechargeVolume: area * rechargeDepth * fractionReachingAquifer };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { area: 10000, rechargeDepth: 0.1, fractionReachingAquifer: 0.6 },
  output: { rechargeVolume: 600 },
} satisfies ToolExample<Input, Output>;
export const groundwaterRechargeAreaDepthVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/groundwater-recharge-area-depth-volume",
    title: "Groundwater Recharge Area Depth Volume Tool",
    description:
      "Calculate groundwater recharge area depth volume from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        rechargeDepth: { type: "number", minimum: 0 },
        fractionReachingAquifer: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["area", "rechargeDepth", "fractionReachingAquifer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rechargeVolume: { type: "number" } },
      required: ["rechargeVolume"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rechargeDepth",
          label: "Recharge Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fractionReachingAquifer",
          label: "Fraction Reaching Aquifer",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rechargeVolume",
          label: "Recharge Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = groundwaterRechargeAreaDepthVolumeTool.execute;
export default groundwaterRechargeAreaDepthVolumeTool;
