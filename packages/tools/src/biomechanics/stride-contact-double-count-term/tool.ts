import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftContact: number;
  readonly rightContact: number;
  readonly simultaneous: number;
  readonly cycleDuration: number;
};
export type Output = {
  readonly unionContact: number;
  readonly flightDuration: number;
  readonly contactFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftContact: { type: "number", minimum: 0 },
    rightContact: { type: "number", minimum: 0 },
    simultaneous: { type: "number", minimum: 0 },
    cycleDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["leftContact", "rightContact", "simultaneous", "cycleDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unionContact: { type: "number" },
    flightDuration: { type: "number" },
    contactFraction: { type: "number" },
  },
  required: ["unionContact", "flightDuration", "contactFraction"],
} as const;
/** Calculate stride contact double count term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftContact, rightContact, simultaneous, cycleDuration } = request;
  const compute = (): Output => {
    H.positive(cycleDuration);
    const unionContact = leftContact + rightContact - simultaneous;
    H.domain(
      leftContact >= 0 &&
        rightContact >= 0 &&
        simultaneous >= 0 &&
        simultaneous <= Math.min(leftContact, rightContact) &&
        unionContact <= cycleDuration,
    );
    return {
      unionContact,
      flightDuration: cycleDuration - unionContact,
      contactFraction: unionContact / cycleDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    leftContact: 0.6,
    rightContact: 0.6,
    simultaneous: 0.2,
    cycleDuration: 1,
  },
  output: { unionContact: 1, flightDuration: 0, contactFraction: 1 },
} satisfies ToolExample<Input, Output>;
export const strideContactDoubleCountTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/stride-contact-double-count-term",
    title: "Stride Contact Double Count Term Tool",
    description:
      "Calculate stride contact double count term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftContact: { type: "number", minimum: 0 },
        rightContact: { type: "number", minimum: 0 },
        simultaneous: { type: "number", minimum: 0 },
        cycleDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "leftContact",
        "rightContact",
        "simultaneous",
        "cycleDuration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unionContact: { type: "number" },
        flightDuration: { type: "number" },
        contactFraction: { type: "number" },
      },
      required: ["unionContact", "flightDuration", "contactFraction"],
    },
    ports: {
      inputs: [
        {
          id: "leftContact",
          label: "Left Contact",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightContact",
          label: "Right Contact",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "simultaneous",
          label: "Simultaneous",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycleDuration",
          label: "Cycle Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unionContact",
          label: "Union Contact",
          valueType: { type: "number" },
        },
        {
          id: "flightDuration",
          label: "Flight Duration",
          valueType: { type: "number" },
        },
        {
          id: "contactFraction",
          label: "Contact Fraction",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = strideContactDoubleCountTermTool.execute;
export default strideContactDoubleCountTermTool;
