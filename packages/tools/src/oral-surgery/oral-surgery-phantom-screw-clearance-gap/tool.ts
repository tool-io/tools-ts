import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly holeDiameter: number;
  readonly screwDiameter: number;
  readonly eccentricity: number;
};
export type Output = {
  readonly radialClearance: number;
  readonly minimumGap: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    holeDiameter: { type: "number", minimum: 0 },
    screwDiameter: { type: "number", minimum: 0 },
    eccentricity: { type: "number", minimum: 0 },
  },
  required: ["holeDiameter", "screwDiameter", "eccentricity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radialClearance: { type: "number" },
    minimumGap: { type: "number" },
    fits: { type: "boolean" },
  },
  required: ["radialClearance", "minimumGap", "fits"],
} as const;
/** Calculate oral surgery phantom screw clearance gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { holeDiameter, screwDiameter, eccentricity } = request;
  const compute = (): Output => {
    H.domain(holeDiameter >= 0 && screwDiameter >= 0 && eccentricity >= 0);
    return {
      radialClearance: (holeDiameter - screwDiameter) / 2,
      minimumGap: (holeDiameter - screwDiameter) / 2 - eccentricity,
      fits: holeDiameter - screwDiameter >= 2 * eccentricity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { holeDiameter: 5, screwDiameter: 4, eccentricity: 0.2 },
  output: { radialClearance: 0.5, minimumGap: 0.3, fits: true },
} satisfies ToolExample<Input, Output>;
export const oralSurgeryPhantomScrewClearanceGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "oral-surgery/oral-surgery-phantom-screw-clearance-gap",
      title: "Oral Surgery Phantom Screw Clearance Gap Tool",
      description:
        "Calculate oral surgery phantom screw clearance gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          holeDiameter: { type: "number", minimum: 0 },
          screwDiameter: { type: "number", minimum: 0 },
          eccentricity: { type: "number", minimum: 0 },
        },
        required: ["holeDiameter", "screwDiameter", "eccentricity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          radialClearance: { type: "number" },
          minimumGap: { type: "number" },
          fits: { type: "boolean" },
        },
        required: ["radialClearance", "minimumGap", "fits"],
      },
      ports: {
        inputs: [
          {
            id: "holeDiameter",
            label: "Hole Diameter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "screwDiameter",
            label: "Screw Diameter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "eccentricity",
            label: "Eccentricity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "radialClearance",
            label: "Radial Clearance",
            valueType: { type: "number" },
          },
          {
            id: "minimumGap",
            label: "Minimum Gap",
            valueType: { type: "number" },
          },
          { id: "fits", label: "Fits", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = oralSurgeryPhantomScrewClearanceGapTool.execute;
export default oralSurgeryPhantomScrewClearanceGapTool;
