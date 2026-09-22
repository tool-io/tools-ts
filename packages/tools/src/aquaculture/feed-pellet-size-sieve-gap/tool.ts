import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pelletDiameter: number;
  readonly lowerOpening: number;
  readonly upperOpening: number;
  readonly includeUpper: boolean;
};
export type Output = {
  readonly inBand: boolean;
  readonly lowerGap: number;
  readonly upperGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pelletDiameter: { type: "number", minimum: 0 },
    lowerOpening: { type: "number", minimum: 0 },
    upperOpening: { type: "number" },
    includeUpper: { type: "boolean" },
  },
  required: ["pelletDiameter", "lowerOpening", "upperOpening", "includeUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inBand: { type: "boolean" },
    lowerGap: { type: "number" },
    upperGap: { type: "number" },
  },
  required: ["inBand", "lowerGap", "upperGap"],
} as const;
/** Calculate feed pellet size sieve gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pelletDiameter, lowerOpening, upperOpening, includeUpper } = request;
  const compute = (): Output => {
    H.domain(
      pelletDiameter >= 0 && lowerOpening >= 0 && upperOpening >= lowerOpening,
    );
    return {
      inBand:
        pelletDiameter >= lowerOpening &&
        (includeUpper
          ? pelletDiameter <= upperOpening
          : pelletDiameter < upperOpening),
      lowerGap: pelletDiameter - lowerOpening,
      upperGap: upperOpening - pelletDiameter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pelletDiameter: 3,
    lowerOpening: 2,
    upperOpening: 4,
    includeUpper: false,
  },
  output: { inBand: true, lowerGap: 1, upperGap: 1 },
} satisfies ToolExample<Input, Output>;
export const feedPelletSizeSieveGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/feed-pellet-size-sieve-gap",
    title: "Feed Pellet Size Sieve Gap Tool",
    description:
      "Calculate feed pellet size sieve gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pelletDiameter: { type: "number", minimum: 0 },
        lowerOpening: { type: "number", minimum: 0 },
        upperOpening: { type: "number" },
        includeUpper: { type: "boolean" },
      },
      required: [
        "pelletDiameter",
        "lowerOpening",
        "upperOpening",
        "includeUpper",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inBand: { type: "boolean" },
        lowerGap: { type: "number" },
        upperGap: { type: "number" },
      },
      required: ["inBand", "lowerGap", "upperGap"],
    },
    ports: {
      inputs: [
        {
          id: "pelletDiameter",
          label: "Pellet Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerOpening",
          label: "Lower Opening",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperOpening",
          label: "Upper Opening",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeUpper",
          label: "Include Upper",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "inBand", label: "In Band", valueType: { type: "boolean" } },
        { id: "lowerGap", label: "Lower Gap", valueType: { type: "number" } },
        { id: "upperGap", label: "Upper Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = feedPelletSizeSieveGapTool.execute;
export default feedPelletSizeSieveGapTool;
