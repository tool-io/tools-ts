import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly antennaLateral: number;
  readonly suppliedImplementOffset: number;
  readonly offsetPositiveLeft: boolean;
};
export type Output = { readonly implementLateral: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    antennaLateral: { type: "number" },
    suppliedImplementOffset: { type: "number" },
    offsetPositiveLeft: { type: "boolean" },
  },
  required: ["antennaLateral", "suppliedImplementOffset", "offsetPositiveLeft"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { implementLateral: { type: "number" } },
  required: ["implementLateral"],
} as const;
/** Translate supplied lateral coordinates with an explicit offset sign, without automatic machine control. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { antennaLateral, suppliedImplementOffset, offsetPositiveLeft } =
    request;
  const compute = (): Output => {
    return {
      implementLateral:
        antennaLateral +
        suppliedImplementOffset * (offsetPositiveLeft ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    antennaLateral: 2,
    suppliedImplementOffset: 0.5,
    offsetPositiveLeft: true,
  },
  output: { implementLateral: 2.5 },
} satisfies ToolExample<Input, Output>;
export const implementAntennaSideOffsetTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/implement-antenna-side-offset-token",
    title: "Implement Antenna Side Offset Token Tool",
    description:
      "Translate supplied lateral coordinates with an explicit offset sign, without automatic machine control.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        antennaLateral: { type: "number" },
        suppliedImplementOffset: { type: "number" },
        offsetPositiveLeft: { type: "boolean" },
      },
      required: [
        "antennaLateral",
        "suppliedImplementOffset",
        "offsetPositiveLeft",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { implementLateral: { type: "number" } },
      required: ["implementLateral"],
    },
    ports: {
      inputs: [
        {
          id: "antennaLateral",
          label: "Antenna Lateral",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedImplementOffset",
          label: "Supplied Implement Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offsetPositiveLeft",
          label: "Offset Positive Left",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "implementLateral",
          label: "Implement Lateral",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = implementAntennaSideOffsetTokenTool.execute;
export default implementAntennaSideOffsetTokenTool;
