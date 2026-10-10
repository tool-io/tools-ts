import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPeakMilliseconds: number;
  readonly secondPeakMilliseconds: number;
};
export type Output = { readonly interpeakMilliseconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPeakMilliseconds: { type: "number" },
    secondPeakMilliseconds: { type: "number" },
  },
  required: ["firstPeakMilliseconds", "secondPeakMilliseconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { interpeakMilliseconds: { type: "number" } },
  required: ["interpeakMilliseconds"],
} as const;
/** Return a signed interval between explicit evoked-potential peak markers without identifying peaks or judging conduction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPeakMilliseconds, secondPeakMilliseconds } = request;
  const compute = (): Output => {
    return {
      interpeakMilliseconds: secondPeakMilliseconds - firstPeakMilliseconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPeakMilliseconds: 10, secondPeakMilliseconds: 15 },
  output: { interpeakMilliseconds: 5 },
} satisfies ToolExample<Input, Output>;
export const evokedPotentialInterpeakTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neurology", "health and medicine"],
      keywords: ["neurology", "health and medicine"],
    },
    id: "neurology/evoked-potential-interpeak-time",
    title: "Evoked Potential Interpeak Time",
    description:
      "Return a signed interval between explicit evoked-potential peak markers without identifying peaks or judging conduction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPeakMilliseconds: { type: "number" },
        secondPeakMilliseconds: { type: "number" },
      },
      required: ["firstPeakMilliseconds", "secondPeakMilliseconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { interpeakMilliseconds: { type: "number" } },
      required: ["interpeakMilliseconds"],
    },
    ports: {
      inputs: [
        {
          id: "firstPeakMilliseconds",
          label: "First Peak Milliseconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondPeakMilliseconds",
          label: "Second Peak Milliseconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "interpeakMilliseconds",
          label: "Interpeak Milliseconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = evokedPotentialInterpeakTimeTool.execute;
export default evokedPotentialInterpeakTimeTool;
