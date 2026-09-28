import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly viewDistance: number;
  readonly angularHeightRadians: number;
  readonly capHeightFraction: number;
};
export type Output = { readonly capHeight: number; readonly emHeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    viewDistance: { type: "number", minimum: 0 },
    angularHeightRadians: { type: "number", minimum: 0 },
    capHeightFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["viewDistance", "angularHeightRadians", "capHeightFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { capHeight: { type: "number" }, emHeight: { type: "number" } },
  required: ["capHeight", "emHeight"],
} as const;
/** Letter-height geometry for a caller-selected angular target; the result does not establish readability or a safety-sign standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { viewDistance, angularHeightRadians, capHeightFraction } = request;
  const compute = (): Output => {
    H.domain(
      viewDistance >= 0 &&
        angularHeightRadians >= 0 &&
        angularHeightRadians < Math.PI,
    );
    H.domain(capHeightFraction > 0 && capHeightFraction <= 1);
    return {
      capHeight: 2 * viewDistance * Math.tan(angularHeightRadians / 2),
      emHeight:
        (2 * viewDistance * Math.tan(angularHeightRadians / 2)) /
        capHeightFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    viewDistance: 10,
    angularHeightRadians: 0.02,
    capHeightFraction: 0.7,
  },
  output: { capHeight: 0.20000666693334415, emHeight: 0.28572380990477736 },
} satisfies ToolExample<Input, Output>;
export const posterSafeViewDistanceLetterHeightTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "graphic-design/poster-safe-view-distance-letter-height-term",
      title: "Poster Safe View Distance Letter Height Term Tool",
      description:
        "Letter-height geometry for a caller-selected angular target; the result does not establish readability or a safety-sign standard.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          viewDistance: { type: "number", minimum: 0 },
          angularHeightRadians: { type: "number", minimum: 0 },
          capHeightFraction: {
            type: "number",
            exclusiveMinimum: 0,
            maximum: 1,
          },
        },
        required: ["viewDistance", "angularHeightRadians", "capHeightFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          capHeight: { type: "number" },
          emHeight: { type: "number" },
        },
        required: ["capHeight", "emHeight"],
      },
      ports: {
        inputs: [
          {
            id: "viewDistance",
            label: "View Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "angularHeightRadians",
            label: "Angular Height Radians",
            required: true,
            valueType: { type: "number", unit: "rad" },
          },
          {
            id: "capHeightFraction",
            label: "Cap Height Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "capHeight",
            label: "Cap Height",
            valueType: { type: "number" },
          },
          { id: "emHeight", label: "Em Height", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = posterSafeViewDistanceLetterHeightTermTool.execute;
export default posterSafeViewDistanceLetterHeightTermTool;
