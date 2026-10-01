import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly duration: number;
  readonly contactedFraction: number;
  readonly repeatedContacts: number;
};
export type Output = {
  readonly areaTime: number;
  readonly cumulativeAreaTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    duration: { type: "number", minimum: 0 },
    contactedFraction: { type: "number", minimum: 0, maximum: 1 },
    repeatedContacts: { type: "integer", minimum: 0 },
  },
  required: ["area", "duration", "contactedFraction", "repeatedContacts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaTime: { type: "number" },
    cumulativeAreaTime: { type: "number" },
  },
  required: ["areaTime", "cumulativeAreaTime"],
} as const;
/** Calculate occupational skin contact area time term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, duration, contactedFraction, repeatedContacts } = request;
  const compute = (): Output => {
    H.domain(area >= 0 && duration >= 0);
    H.probability(contactedFraction);
    H.integer(repeatedContacts, 0);
    return {
      areaTime: area * contactedFraction * duration,
      cumulativeAreaTime:
        area * contactedFraction * duration * repeatedContacts,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    area: 100,
    duration: 10,
    contactedFraction: 0.2,
    repeatedContacts: 3,
  },
  output: { areaTime: 200, cumulativeAreaTime: 600 },
} satisfies ToolExample<Input, Output>;
export const occupationalSkinContactAreaTimeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "occupational-health/occupational-skin-contact-area-time-term",
      title: "Occupational Skin Contact Area Time Term Tool",
      description:
        "Calculate occupational skin contact area time term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          area: { type: "number", minimum: 0 },
          duration: { type: "number", minimum: 0 },
          contactedFraction: { type: "number", minimum: 0, maximum: 1 },
          repeatedContacts: { type: "integer", minimum: 0 },
        },
        required: ["area", "duration", "contactedFraction", "repeatedContacts"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          areaTime: { type: "number" },
          cumulativeAreaTime: { type: "number" },
        },
        required: ["areaTime", "cumulativeAreaTime"],
      },
      ports: {
        inputs: [
          {
            id: "area",
            label: "Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "duration",
            label: "Duration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "contactedFraction",
            label: "Contacted Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "repeatedContacts",
            label: "Repeated Contacts",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "areaTime", label: "Area Time", valueType: { type: "number" } },
          {
            id: "cumulativeAreaTime",
            label: "Cumulative Area Time",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = occupationalSkinContactAreaTimeTermTool.execute;
export default occupationalSkinContactAreaTimeTermTool;
