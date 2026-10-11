import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedFrontageLength: number;
  readonly unitCount: number;
};
export type Output = { readonly frontagePerUnit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedFrontageLength: { type: "number", minimum: 0 },
    unitCount: { type: "integer", minimum: 1 },
  },
  required: ["recordedFrontageLength", "unitCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { frontagePerUnit: { type: "number" } },
  required: ["frontagePerUnit"],
} as const;
/** Divide explicit public-space frontage length by a supplied positive unit count without assessing public-space adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedFrontageLength, unitCount } = request;
  const compute = (): Output => {
    H.domain(recordedFrontageLength >= 0, "recordedFrontageLength");
    (H.domain(
      Number.isSafeInteger(unitCount) &&
        unitCount >= 1 &&
        unitCount <= Number.MAX_SAFE_INTEGER,
      "unitCount",
    ),
      unitCount);
    return { frontagePerUnit: recordedFrontageLength / unitCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedFrontageLength: 120, unitCount: 30 },
  output: { frontagePerUnit: 4 },
} satisfies ToolExample<Input, Output>;
export const publicSpaceFrontagePerUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["urban-planning", "urban planning", "arts and design"],
      keywords: ["urban planning", "arts and design"],
    },
    id: "urban-planning/public-space-frontage-per-unit",
    title: "Public Space Frontage Per Unit",
    description:
      "Divide explicit public-space frontage length by a supplied positive unit count without assessing public-space adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedFrontageLength: { type: "number", minimum: 0 },
        unitCount: { type: "integer", minimum: 1 },
      },
      required: ["recordedFrontageLength", "unitCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { frontagePerUnit: { type: "number" } },
      required: ["frontagePerUnit"],
    },
    ports: {
      inputs: [
        {
          id: "recordedFrontageLength",
          label: "Recorded Frontage Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitCount",
          label: "Unit Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "frontagePerUnit",
          label: "Frontage Per Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicSpaceFrontagePerUnitTool.execute;
export default publicSpaceFrontagePerUnitTool;
