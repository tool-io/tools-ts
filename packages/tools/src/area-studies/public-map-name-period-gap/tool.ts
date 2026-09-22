import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mapDay: number;
  readonly nameValidFrom: number;
  readonly nameValidUntil: number;
};
export type Output = {
  readonly withinPeriod: boolean;
  readonly earlierGap: number;
  readonly laterGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mapDay: { type: "integer" },
    nameValidFrom: { type: "integer" },
    nameValidUntil: { type: "integer" },
  },
  required: ["mapDay", "nameValidFrom", "nameValidUntil"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    withinPeriod: { type: "boolean" },
    earlierGap: { type: "integer" },
    laterGap: { type: "integer" },
  },
  required: ["withinPeriod", "earlierGap", "laterGap"],
} as const;
/** Compare supplied public-map/name-vintage intervals, not a territorial or naming claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mapDay, nameValidFrom, nameValidUntil } = request;
  const compute = (): Output => {
    H.domain(nameValidUntil >= nameValidFrom);
    return {
      withinPeriod: mapDay >= nameValidFrom && mapDay <= nameValidUntil,
      earlierGap: Math.max(0, nameValidFrom - mapDay),
      laterGap: Math.max(0, mapDay - nameValidUntil),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mapDay: 50, nameValidFrom: 40, nameValidUntil: 60 },
  output: { withinPeriod: true, earlierGap: 0, laterGap: 0 },
} satisfies ToolExample<Input, Output>;
export const publicMapNamePeriodGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "area-studies/public-map-name-period-gap",
    title: "Public Map Name Period Gap Tool",
    description:
      "Compare supplied public-map/name-vintage intervals, not a territorial or naming claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mapDay: { type: "integer" },
        nameValidFrom: { type: "integer" },
        nameValidUntil: { type: "integer" },
      },
      required: ["mapDay", "nameValidFrom", "nameValidUntil"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        withinPeriod: { type: "boolean" },
        earlierGap: { type: "integer" },
        laterGap: { type: "integer" },
      },
      required: ["withinPeriod", "earlierGap", "laterGap"],
    },
    ports: {
      inputs: [
        {
          id: "mapDay",
          label: "Map Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nameValidFrom",
          label: "Name Valid From",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nameValidUntil",
          label: "Name Valid Until",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "withinPeriod",
          label: "Within Period",
          valueType: { type: "boolean" },
        },
        {
          id: "earlierGap",
          label: "Earlier Gap",
          valueType: { type: "integer" },
        },
        { id: "laterGap", label: "Later Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = publicMapNamePeriodGapTool.execute;
export default publicMapNamePeriodGapTool;
