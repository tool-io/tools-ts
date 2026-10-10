import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStartUtcMinutes: number;
  readonly firstEndUtcMinutes: number;
  readonly secondStartUtcMinutes: number;
  readonly secondEndUtcMinutes: number;
};
export type Output = { readonly overlapMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStartUtcMinutes: { type: "number" },
    firstEndUtcMinutes: { type: "number" },
    secondStartUtcMinutes: { type: "number" },
    secondEndUtcMinutes: { type: "number" },
  },
  required: [
    "firstStartUtcMinutes",
    "firstEndUtcMinutes",
    "secondStartUtcMinutes",
    "secondEndUtcMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlapMinutes: { type: "number" } },
  required: ["overlapMinutes"],
} as const;
/** Intersect two explicitly UTC-normalized service intervals without resolving time zones or daylight-saving rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstStartUtcMinutes,
    firstEndUtcMinutes,
    secondStartUtcMinutes,
    secondEndUtcMinutes,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstEndUtcMinutes >= firstStartUtcMinutes &&
        secondEndUtcMinutes >= secondStartUtcMinutes,
      "firstEndUtcMinutes",
    );
    return {
      overlapMinutes: Math.max(
        0,
        Math.min(firstEndUtcMinutes, secondEndUtcMinutes) -
          Math.max(firstStartUtcMinutes, secondStartUtcMinutes),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstStartUtcMinutes: 480,
    firstEndUtcMinutes: 960,
    secondStartUtcMinutes: 840,
    secondEndUtcMinutes: 1200,
  },
  output: { overlapMinutes: 120 },
} satisfies ToolExample<Input, Output>;
export const internationalServiceTimeOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "international-business",
        "international business",
        "business and finance",
      ],
      keywords: ["international business", "business and finance"],
    },
    id: "international-business/international-service-time-overlap",
    title: "International Service Time Overlap",
    description:
      "Intersect two explicitly UTC-normalized service intervals without resolving time zones or daylight-saving rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStartUtcMinutes: { type: "number" },
        firstEndUtcMinutes: { type: "number" },
        secondStartUtcMinutes: { type: "number" },
        secondEndUtcMinutes: { type: "number" },
      },
      required: [
        "firstStartUtcMinutes",
        "firstEndUtcMinutes",
        "secondStartUtcMinutes",
        "secondEndUtcMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overlapMinutes: { type: "number" } },
      required: ["overlapMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "firstStartUtcMinutes",
          label: "First Start Utc Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstEndUtcMinutes",
          label: "First End Utc Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStartUtcMinutes",
          label: "Second Start Utc Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondEndUtcMinutes",
          label: "Second End Utc Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapMinutes",
          label: "Overlap Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = internationalServiceTimeOverlapTool.execute;
export default internationalServiceTimeOverlapTool;
