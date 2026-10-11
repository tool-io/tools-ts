import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseRent: number;
  readonly rawIndexChangeFraction: number;
  readonly floorFraction: number;
  readonly capFraction: number;
};
export type Output = {
  readonly appliedChangeFraction: number;
  readonly revisedRent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseRent: { type: "number", minimum: 0 },
    rawIndexChangeFraction: { type: "number" },
    floorFraction: { type: "number", minimum: -1 },
    capFraction: { type: "number" },
  },
  required: [
    "baseRent",
    "rawIndexChangeFraction",
    "floorFraction",
    "capFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    appliedChangeFraction: { type: "number" },
    revisedRent: { type: "number" },
  },
  required: ["appliedChangeFraction", "revisedRent"],
} as const;
/** Clamp an explicitly supplied lease index change between a floor and cap before applying it once to base rent. No index series or lease interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseRent, rawIndexChangeFraction, floorFraction, capFraction } =
    request;
  const compute = (): Output => {
    H.domain(
      baseRent >= 0 && floorFraction >= -1 && capFraction >= floorFraction,
      "baseRent",
    );
    return (() => {
      const appliedChangeFraction = Math.max(
        floorFraction,
        Math.min(capFraction, rawIndexChangeFraction),
      );
      return {
        appliedChangeFraction,
        revisedRent: baseRent * (1 + appliedChangeFraction),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baseRent: 1000,
    rawIndexChangeFraction: 0.08,
    floorFraction: 0,
    capFraction: 0.05,
  },
  output: { appliedChangeFraction: 0.05, revisedRent: 1050 },
} satisfies ToolExample<Input, Output>;
export const leaseIndexCapFloorApplierTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["real-estate", "real estate", "business and finance"],
      keywords: ["real estate", "business and finance"],
    },
    id: "real-estate/lease-index-cap-floor-applier",
    title: "Lease Index Cap Floor Applier",
    description:
      "Clamp an explicitly supplied lease index change between a floor and cap before applying it once to base rent. No index series or lease interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseRent: { type: "number", minimum: 0 },
        rawIndexChangeFraction: { type: "number" },
        floorFraction: { type: "number", minimum: -1 },
        capFraction: { type: "number" },
      },
      required: [
        "baseRent",
        "rawIndexChangeFraction",
        "floorFraction",
        "capFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        appliedChangeFraction: { type: "number" },
        revisedRent: { type: "number" },
      },
      required: ["appliedChangeFraction", "revisedRent"],
    },
    ports: {
      inputs: [
        {
          id: "baseRent",
          label: "Base Rent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rawIndexChangeFraction",
          label: "Raw Index Change Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "floorFraction",
          label: "Floor Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capFraction",
          label: "Cap Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "appliedChangeFraction",
          label: "Applied Change Fraction",
          valueType: { type: "number" },
        },
        {
          id: "revisedRent",
          label: "Revised Rent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = leaseIndexCapFloorApplierTool.execute;
export default leaseIndexCapFloorApplierTool;
