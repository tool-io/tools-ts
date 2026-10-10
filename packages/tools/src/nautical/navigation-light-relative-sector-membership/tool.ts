import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bearingDegrees: number;
  readonly sectorStartDegrees: number;
  readonly sectorWidthDegrees: number;
  readonly includeEnd: boolean;
};
export type Output = { readonly inSuppliedSector: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bearingDegrees: { type: "number" },
    sectorStartDegrees: { type: "number" },
    sectorWidthDegrees: { type: "number", minimum: 0, maximum: 360 },
    includeEnd: { type: "boolean" },
  },
  required: [
    "bearingDegrees",
    "sectorStartDegrees",
    "sectorWidthDegrees",
    "includeEnd",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inSuppliedSector: { type: "boolean" } },
  required: ["inSuppliedSector"],
} as const;
/** Test an explicit relative bearing against a supplied clockwise angular sector without selecting statutory navigation-light sectors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bearingDegrees, sectorStartDegrees, sectorWidthDegrees, includeEnd } =
    request;
  const compute = (): Output => {
    H.domain(
      sectorWidthDegrees >= 0 && sectorWidthDegrees <= 360,
      "sectorWidthDegrees",
    );
    return {
      inSuppliedSector: (() => {
        const normalize = (value: number) => {
          const r = value % 360;
          return r < 0 ? (r + 360 === 360 ? 0 : r + 360) : r;
        };
        const offset = normalize(
          normalize(bearingDegrees) - normalize(sectorStartDegrees),
        );
        return (
          sectorWidthDegrees === 360 ||
          offset < sectorWidthDegrees ||
          (includeEnd && offset === sectorWidthDegrees)
        );
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bearingDegrees: 355,
    sectorStartDegrees: 350,
    sectorWidthDegrees: 20,
    includeEnd: false,
  },
  output: { inSuppliedSector: true },
} satisfies ToolExample<Input, Output>;
export const navlightRelativeSectorMembershipTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["nautical", "engineering"],
      keywords: ["nautical", "engineering"],
    },
    id: "nautical/navigation-light-relative-sector-membership",
    title: "Navigation Light Relative Sector Membership",
    description:
      "Test an explicit relative bearing against a supplied clockwise angular sector without selecting statutory navigation-light sectors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bearingDegrees: { type: "number" },
        sectorStartDegrees: { type: "number" },
        sectorWidthDegrees: { type: "number", minimum: 0, maximum: 360 },
        includeEnd: { type: "boolean" },
      },
      required: [
        "bearingDegrees",
        "sectorStartDegrees",
        "sectorWidthDegrees",
        "includeEnd",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inSuppliedSector: { type: "boolean" } },
      required: ["inSuppliedSector"],
    },
    ports: {
      inputs: [
        {
          id: "bearingDegrees",
          label: "Bearing Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sectorStartDegrees",
          label: "Sector Start Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sectorWidthDegrees",
          label: "Sector Width Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeEnd",
          label: "Include End",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "inSuppliedSector",
          label: "In Supplied Sector",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = navlightRelativeSectorMembershipTool.execute;
export default navlightRelativeSectorMembershipTool;
