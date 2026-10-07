import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly decimalPlaces: number;
};
export type Output = { readonly publicCoordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    decimalPlaces: { type: "integer", minimum: 0, maximum: 15 },
  },
  required: ["coordinate", "decimalPlaces"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { publicCoordinate: { type: "number" } },
  required: ["publicCoordinate"],
} as const;
/** Round one supplied coordinate to an explicit decimal precision using JavaScript nearest rounding without claiming disclosure protection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, decimalPlaces } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(decimalPlaces) &&
        decimalPlaces >= 0 &&
        decimalPlaces <= 15,
      "decimalPlaces",
    ),
      decimalPlaces);
    return (() => {
      const factor = 10 ** decimalPlaces;
      return { publicCoordinate: Math.round(coordinate * factor) / factor };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 12.345, decimalPlaces: 2 },
  output: { publicCoordinate: 12.35 },
} satisfies ToolExample<Input, Output>;
export const protectedSitePublicCoordinateRoundingTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["conservation-biology", "conservation biology", "biology"],
        keywords: ["conservation biology", "biology"],
      },
      id: "conservation-biology/protected-site-public-coordinate-rounding",
      title: "Protected Site Public Coordinate Rounding",
      description:
        "Round one supplied coordinate to an explicit decimal precision using JavaScript nearest rounding without claiming disclosure protection.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coordinate: { type: "number" },
          decimalPlaces: { type: "integer", minimum: 0, maximum: 15 },
        },
        required: ["coordinate", "decimalPlaces"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { publicCoordinate: { type: "number" } },
        required: ["publicCoordinate"],
      },
      ports: {
        inputs: [
          {
            id: "coordinate",
            label: "Coordinate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "decimalPlaces",
            label: "Decimal Places",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "publicCoordinate",
            label: "Public Coordinate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = protectedSitePublicCoordinateRoundingTool.execute;
export default protectedSitePublicCoordinateRoundingTool;
