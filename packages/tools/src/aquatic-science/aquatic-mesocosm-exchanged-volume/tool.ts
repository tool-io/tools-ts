import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mesocosmVolume: number;
  readonly exchangeFraction: number;
};
export type Output = {
  readonly exchangedVolume: number;
  readonly retainedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mesocosmVolume: { type: "number", minimum: 0 },
    exchangeFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["mesocosmVolume", "exchangeFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exchangedVolume: { type: "number" },
    retainedVolume: { type: "number" },
  },
  required: ["exchangedVolume", "retainedVolume"],
} as const;
/** Apply an explicit single-exchange fraction to supplied mesocosm volume without modeling mixing or concentration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mesocosmVolume, exchangeFraction } = request;
  const compute = (): Output => {
    H.domain(mesocosmVolume >= 0, "mesocosmVolume");
    (H.domain(
      exchangeFraction >= 0 && exchangeFraction <= 1,
      "exchangeFraction",
    ),
      exchangeFraction);
    return {
      exchangedVolume: mesocosmVolume * exchangeFraction,
      retainedVolume: mesocosmVolume * (1 - exchangeFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mesocosmVolume: 200, exchangeFraction: 0.25 },
  output: { exchangedVolume: 50, retainedVolume: 150 },
} satisfies ToolExample<Input, Output>;
export const aquaticMesocosmExchangedVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "aquatic-science",
        "aquatic science",
        "earth and environmental sciences",
      ],
      keywords: ["aquatic science", "earth and environmental sciences"],
    },
    id: "aquatic-science/aquatic-mesocosm-exchanged-volume",
    title: "Aquatic Mesocosm Exchanged Volume",
    description:
      "Apply an explicit single-exchange fraction to supplied mesocosm volume without modeling mixing or concentration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mesocosmVolume: { type: "number", minimum: 0 },
        exchangeFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["mesocosmVolume", "exchangeFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exchangedVolume: { type: "number" },
        retainedVolume: { type: "number" },
      },
      required: ["exchangedVolume", "retainedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "mesocosmVolume",
          label: "Mesocosm Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exchangeFraction",
          label: "Exchange Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "exchangedVolume",
          label: "Exchanged Volume",
          valueType: { type: "number" },
        },
        {
          id: "retainedVolume",
          label: "Retained Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaticMesocosmExchangedVolumeTool.execute;
export default aquaticMesocosmExchangedVolumeTool;
