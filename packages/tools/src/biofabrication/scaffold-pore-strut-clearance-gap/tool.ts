import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pitch: number;
  readonly firstWidth: number;
  readonly secondWidth: number;
  readonly swellingFraction: number;
};
export type Output = {
  readonly nominalGap: number;
  readonly swollenGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pitch: { type: "number", minimum: 0 },
    firstWidth: { type: "number", minimum: 0 },
    secondWidth: { type: "number", minimum: 0 },
    swellingFraction: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["pitch", "firstWidth", "secondWidth", "swellingFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalGap: { type: "number" },
    swollenGap: { type: "number" },
  },
  required: ["nominalGap", "swollenGap"],
} as const;
/** Calculate scaffold pore strut clearance gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pitch, firstWidth, secondWidth, swellingFraction } = request;
  const compute = (): Output => {
    H.domain(
      pitch >= 0 &&
        firstWidth >= 0 &&
        secondWidth >= 0 &&
        swellingFraction > -1,
    );
    return {
      nominalGap: pitch - (firstWidth + secondWidth) / 2,
      swollenGap:
        pitch - ((firstWidth + secondWidth) * (1 + swellingFraction)) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pitch: 10, firstWidth: 2, secondWidth: 4, swellingFraction: 0.1 },
  output: { nominalGap: 7, swollenGap: 6.699999999999999 },
} satisfies ToolExample<Input, Output>;
export const scaffoldPoreStrutClearanceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/scaffold-pore-strut-clearance-gap",
    title: "Scaffold Pore Strut Clearance Gap Tool",
    description:
      "Calculate scaffold pore strut clearance gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pitch: { type: "number", minimum: 0 },
        firstWidth: { type: "number", minimum: 0 },
        secondWidth: { type: "number", minimum: 0 },
        swellingFraction: { type: "number", exclusiveMinimum: -1 },
      },
      required: ["pitch", "firstWidth", "secondWidth", "swellingFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalGap: { type: "number" },
        swollenGap: { type: "number" },
      },
      required: ["nominalGap", "swollenGap"],
    },
    ports: {
      inputs: [
        {
          id: "pitch",
          label: "Pitch",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstWidth",
          label: "First Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondWidth",
          label: "Second Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "swellingFraction",
          label: "Swelling Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "nominalGap",
          label: "Nominal Gap",
          valueType: { type: "number" },
        },
        {
          id: "swollenGap",
          label: "Swollen Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scaffoldPoreStrutClearanceGapTool.execute;
export default scaffoldPoreStrutClearanceGapTool;
