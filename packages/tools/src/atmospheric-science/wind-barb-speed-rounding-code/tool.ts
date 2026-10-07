import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly speedKnots: number };
export type Output = {
  readonly roundedKnots: number;
  readonly pennants: number;
  readonly fullBarbs: number;
  readonly halfBarb: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { speedKnots: { type: "number", minimum: 0 } },
  required: ["speedKnots"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roundedKnots: { type: "number" },
    pennants: { type: "integer" },
    fullBarbs: { type: "integer" },
    halfBarb: { type: "boolean" },
  },
  required: ["roundedKnots", "pennants", "fullBarbs", "halfBarb"],
} as const;
/** Round explicit wind speed to the nearest five knots and decompose into 50-knot pennants, 10-knot barbs, and a 5-knot half barb. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speedKnots } = request;
  const compute = (): Output => {
    H.domain(speedKnots >= 0, "speedKnots");
    return (() => {
      const halfUnits = Math.round(speedKnots / 5);
      H.domain(Number.isSafeInteger(halfUnits), "speedKnots");
      return {
        roundedKnots: halfUnits * 5,
        pennants: Math.floor(halfUnits / 10),
        fullBarbs: Math.floor((halfUnits % 10) / 2),
        halfBarb: halfUnits % 2 === 1,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speedKnots: 63 },
  output: { roundedKnots: 65, pennants: 1, fullBarbs: 1, halfBarb: true },
} satisfies ToolExample<Input, Output>;
export const windBarbSpeedRoundingCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "atmospheric-science",
        "atmospheric science",
        "earth and environmental sciences",
      ],
      keywords: ["atmospheric science", "earth and environmental sciences"],
    },
    id: "atmospheric-science/wind-barb-speed-rounding-code",
    title: "Wind Barb Speed Rounding Code",
    description:
      "Round explicit wind speed to the nearest five knots and decompose into 50-knot pennants, 10-knot barbs, and a 5-knot half barb.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { speedKnots: { type: "number", minimum: 0 } },
      required: ["speedKnots"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roundedKnots: { type: "number" },
        pennants: { type: "integer" },
        fullBarbs: { type: "integer" },
        halfBarb: { type: "boolean" },
      },
      required: ["roundedKnots", "pennants", "fullBarbs", "halfBarb"],
    },
    ports: {
      inputs: [
        {
          id: "speedKnots",
          label: "Speed Knots",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "roundedKnots",
          label: "Rounded Knots",
          valueType: { type: "number" },
        },
        { id: "pennants", label: "Pennants", valueType: { type: "integer" } },
        {
          id: "fullBarbs",
          label: "Full Barbs",
          valueType: { type: "integer" },
        },
        { id: "halfBarb", label: "Half Barb", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = windBarbSpeedRoundingCodeTool.execute;
export default windBarbSpeedRoundingCodeTool;
