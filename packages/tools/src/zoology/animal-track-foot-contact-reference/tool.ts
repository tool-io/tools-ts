import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactX: number;
  readonly contactY: number;
  readonly referenceX: number;
  readonly referenceY: number;
  readonly headingDegrees: number;
};
export type Output = { readonly forward: number; readonly lateral: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactX: { type: "number" },
    contactY: { type: "number" },
    referenceX: { type: "number" },
    referenceY: { type: "number" },
    headingDegrees: { type: "number" },
  },
  required: [
    "contactX",
    "contactY",
    "referenceX",
    "referenceY",
    "headingDegrees",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { forward: { type: "number" }, lateral: { type: "number" } },
  required: ["forward", "lateral"],
} as const;
/** Resolve a supplied foot-contact displacement along a counterclockwise heading and its left normal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactX, contactY, referenceX, referenceY, headingDegrees } =
    request;
  const compute = (): Output => {
    return {
      forward:
        (contactX - referenceX) * Math.cos((headingDegrees * Math.PI) / 180) +
        (contactY - referenceY) * Math.sin((headingDegrees * Math.PI) / 180),
      lateral:
        -(contactX - referenceX) * Math.sin((headingDegrees * Math.PI) / 180) +
        (contactY - referenceY) * Math.cos((headingDegrees * Math.PI) / 180),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    contactX: 4,
    contactY: 5,
    referenceX: 1,
    referenceY: 1,
    headingDegrees: 0,
  },
  output: { forward: 3, lateral: 4 },
} satisfies ToolExample<Input, Output>;
export const animalTrackFootContactReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/animal-track-foot-contact-reference",
    title: "Animal Track Foot Contact Reference Tool",
    description:
      "Resolve a supplied foot-contact displacement along a counterclockwise heading and its left normal.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactX: { type: "number" },
        contactY: { type: "number" },
        referenceX: { type: "number" },
        referenceY: { type: "number" },
        headingDegrees: { type: "number" },
      },
      required: [
        "contactX",
        "contactY",
        "referenceX",
        "referenceY",
        "headingDegrees",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { forward: { type: "number" }, lateral: { type: "number" } },
      required: ["forward", "lateral"],
    },
    ports: {
      inputs: [
        {
          id: "contactX",
          label: "Contact X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contactY",
          label: "Contact Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceX",
          label: "Reference X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceY",
          label: "Reference Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "headingDegrees",
          label: "Heading Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "forward", label: "Forward", valueType: { type: "number" } },
        { id: "lateral", label: "Lateral", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = animalTrackFootContactReferenceTool.execute;
export default animalTrackFootContactReferenceTool;
