import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionMinutes: number;
  readonly exposedFraction: number;
};
export type Output = { readonly exposureMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionMinutes: { type: "number", minimum: 0 },
    exposedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["sessionMinutes", "exposedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { exposureMinutes: { type: "number" } },
  required: ["exposureMinutes"],
} as const;
/** Apply an explicitly recorded exposure fraction to supplied session minutes without assessing intervention efficacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionMinutes, exposedFraction } = request;
  const compute = (): Output => {
    H.domain(sessionMinutes >= 0, "sessionMinutes");
    (H.domain(exposedFraction >= 0 && exposedFraction <= 1, "exposedFraction"),
      exposedFraction);
    return { exposureMinutes: sessionMinutes * exposedFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sessionMinutes: 40, exposedFraction: 0.75 },
  output: { exposureMinutes: 30 },
} satisfies ToolExample<Input, Output>;
export const interventionExposureMinuteContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["behavioral-science", "behavioral science", "psychology"],
        keywords: ["behavioral science", "psychology"],
      },
      id: "behavioral-science/intervention-exposure-minute-contribution",
      title: "Intervention Exposure Minute Contribution",
      description:
        "Apply an explicitly recorded exposure fraction to supplied session minutes without assessing intervention efficacy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sessionMinutes: { type: "number", minimum: 0 },
          exposedFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["sessionMinutes", "exposedFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { exposureMinutes: { type: "number" } },
        required: ["exposureMinutes"],
      },
      ports: {
        inputs: [
          {
            id: "sessionMinutes",
            label: "Session Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exposedFraction",
            label: "Exposed Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "exposureMinutes",
            label: "Exposure Minutes",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = interventionExposureMinuteContributionTool.execute;
export default interventionExposureMinuteContributionTool;
