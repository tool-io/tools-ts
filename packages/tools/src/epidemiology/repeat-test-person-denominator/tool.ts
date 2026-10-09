import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personIds: readonly string[];
  readonly included: readonly boolean[];
};
export type Output = {
  readonly includedTests: number;
  readonly distinctPersons: number;
  readonly repeatTests: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    included: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["personIds", "included"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    includedTests: { type: "integer" },
    distinctPersons: { type: "integer" },
    repeatTests: { type: "integer" },
  },
  required: ["includedTests", "distinctPersons", "repeatTests"],
} as const;
/** Count unique explicitly identified persons among included tests while reporting repeat tests separately. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personIds, included } = request;
  const compute = (): Output => {
    H.domain(personIds.length === included.length, "included");
    H.domain(
      personIds.every((v) => v.length > 0),
      "personIds",
    );
    const ids = personIds.filter((_, i) => included[i]);
    const distinctPersons = new Set(ids).size;
    return {
      includedTests: ids.length,
      distinctPersons,
      repeatTests: ids.length - distinctPersons,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { personIds: ["P1", "P1", "P2"], included: [true, true, true] },
  output: { includedTests: 3, distinctPersons: 2, repeatTests: 1 },
} satisfies ToolExample<Input, Output>;
export const repeatTestPersonDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["epidemiology", "health and medicine"],
      keywords: ["epidemiology", "health and medicine"],
    },
    id: "epidemiology/repeat-test-person-denominator",
    title: "Repeat Test Person Denominator",
    description:
      "Count unique explicitly identified persons among included tests while reporting repeat tests separately.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        included: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["personIds", "included"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        includedTests: { type: "integer" },
        distinctPersons: { type: "integer" },
        repeatTests: { type: "integer" },
      },
      required: ["includedTests", "distinctPersons", "repeatTests"],
    },
    ports: {
      inputs: [
        {
          id: "personIds",
          label: "Person Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "included",
          label: "Included",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "includedTests",
          label: "Included Tests",
          valueType: { type: "integer" },
        },
        {
          id: "distinctPersons",
          label: "Distinct Persons",
          valueType: { type: "integer" },
        },
        {
          id: "repeatTests",
          label: "Repeat Tests",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = repeatTestPersonDenominatorTool.execute;
export default repeatTestPersonDenominatorTool;
