import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feedFlow: number;
  readonly vaporFraction: number;
  readonly feedComposition: number;
  readonly liquidComposition: number;
};
export type Output = {
  readonly vaporFlow: number;
  readonly liquidFlow: number;
  readonly vaporComposition: number;
  readonly vaporComponentFlow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedFlow: { type: "number", minimum: 0 },
    vaporFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    feedComposition: { type: "number", minimum: 0, maximum: 1 },
    liquidComposition: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "feedFlow",
    "vaporFraction",
    "feedComposition",
    "liquidComposition",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vaporFlow: { type: "number" },
    liquidFlow: { type: "number" },
    vaporComposition: { type: "number" },
    vaporComponentFlow: { type: "number" },
  },
  required: [
    "vaporFlow",
    "liquidFlow",
    "vaporComposition",
    "vaporComponentFlow",
  ],
} as const;
/** Infer one vapor component fraction by feed/phase-flow balance; vaporComponentFlow is the amount assigned to vapor, and out-of-range compositions expose inconsistent inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { feedFlow, vaporFraction, feedComposition, liquidComposition } =
    request;
  const compute = (): Output => {
    H.domain(feedFlow >= 0 && vaporFraction > 0 && vaporFraction <= 1);
    H.probability(feedComposition);
    H.probability(liquidComposition);
    return {
      vaporFlow: feedFlow * vaporFraction,
      liquidFlow: feedFlow * (1 - vaporFraction),
      vaporComposition:
        (feedComposition - (1 - vaporFraction) * liquidComposition) /
        vaporFraction,
      vaporComponentFlow:
        feedFlow * feedComposition -
        feedFlow * (1 - vaporFraction) * liquidComposition,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    feedFlow: 100,
    vaporFraction: 0.5,
    feedComposition: 0.4,
    liquidComposition: 0.2,
  },
  output: {
    vaporFlow: 50,
    liquidFlow: 50,
    vaporComposition: 0.6000000000000001,
    vaporComponentFlow: 30,
  },
} satisfies ToolExample<Input, Output>;
export const flashVaporLiquidOneComponentBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chemical-engineering/flash-vapor-liquid-one-component-balance",
      title: "Flash Vapor Liquid One Component Balance Tool",
      description:
        "Infer one vapor component fraction by feed/phase-flow balance; vaporComponentFlow is the amount assigned to vapor, and out-of-range compositions expose inconsistent inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          feedFlow: { type: "number", minimum: 0 },
          vaporFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
          feedComposition: { type: "number", minimum: 0, maximum: 1 },
          liquidComposition: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "feedFlow",
          "vaporFraction",
          "feedComposition",
          "liquidComposition",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          vaporFlow: { type: "number" },
          liquidFlow: { type: "number" },
          vaporComposition: { type: "number" },
          vaporComponentFlow: { type: "number" },
        },
        required: [
          "vaporFlow",
          "liquidFlow",
          "vaporComposition",
          "vaporComponentFlow",
        ],
      },
      ports: {
        inputs: [
          {
            id: "feedFlow",
            label: "Feed Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "vaporFraction",
            label: "Vapor Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "feedComposition",
            label: "Feed Composition",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "liquidComposition",
            label: "Liquid Composition",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "vaporFlow",
            label: "Vapor Flow",
            valueType: { type: "number" },
          },
          {
            id: "liquidFlow",
            label: "Liquid Flow",
            valueType: { type: "number" },
          },
          {
            id: "vaporComposition",
            label: "Vapor Composition",
            valueType: { type: "number" },
          },
          {
            id: "vaporComponentFlow",
            label: "Vapor Component Flow",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = flashVaporLiquidOneComponentBalanceTool.execute;
export default flashVaporLiquidOneComponentBalanceTool;
