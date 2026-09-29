import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objects: number;
  readonly visits: number;
  readonly unavailableObjectVisits: number;
};
export type Output = {
  readonly nominalObjectVisits: number;
  readonly usableObjectVisits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objects: { type: "integer", minimum: 0 },
    visits: { type: "integer", minimum: 0 },
    unavailableObjectVisits: { type: "integer", minimum: 0 },
  },
  required: ["objects", "visits", "unavailableObjectVisits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalObjectVisits: { type: "integer" },
    usableObjectVisits: { type: "integer" },
  },
  required: ["nominalObjectVisits", "usableObjectVisits"],
} as const;
/** Calculate survey cover object exposure from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objects, visits, unavailableObjectVisits } = request;
  const compute = (): Output => {
    H.integer(objects, 0);
    H.integer(visits, 0);
    H.integer(unavailableObjectVisits, 0);
    H.domain(
      BigInt(unavailableObjectVisits) <= BigInt(objects) * BigInt(visits),
    );
    return {
      nominalObjectVisits: Number(BigInt(objects) * BigInt(visits)),
      usableObjectVisits: Number(
        BigInt(objects) * BigInt(visits) - BigInt(unavailableObjectVisits),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { objects: 10, visits: 4, unavailableObjectVisits: 5 },
  output: { nominalObjectVisits: 40, usableObjectVisits: 35 },
} satisfies ToolExample<Input, Output>;
export const surveyCoverObjectExposureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/survey-cover-object-exposure",
    title: "Survey Cover Object Exposure Tool",
    description:
      "Calculate survey cover object exposure from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objects: { type: "integer", minimum: 0 },
        visits: { type: "integer", minimum: 0 },
        unavailableObjectVisits: { type: "integer", minimum: 0 },
      },
      required: ["objects", "visits", "unavailableObjectVisits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalObjectVisits: { type: "integer" },
        usableObjectVisits: { type: "integer" },
      },
      required: ["nominalObjectVisits", "usableObjectVisits"],
    },
    ports: {
      inputs: [
        {
          id: "objects",
          label: "Objects",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "visits",
          label: "Visits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unavailableObjectVisits",
          label: "Unavailable Object Visits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nominalObjectVisits",
          label: "Nominal Object Visits",
          valueType: { type: "integer" },
        },
        {
          id: "usableObjectVisits",
          label: "Usable Object Visits",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = surveyCoverObjectExposureTool.execute;
export default surveyCoverObjectExposureTool;
