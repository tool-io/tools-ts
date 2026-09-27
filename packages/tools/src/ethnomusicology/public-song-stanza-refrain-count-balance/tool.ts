import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stanzas: number;
  readonly stanzaLines: number;
  readonly refrainLines: number;
  readonly refrainOccurrences: number;
};
export type Output = {
  readonly stanzaLineTotal: number;
  readonly refrainLineTotal: number;
  readonly totalLines: number;
  readonly refrainFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stanzas: { type: "integer", minimum: 0 },
    stanzaLines: { type: "integer", minimum: 0 },
    refrainLines: { type: "integer", minimum: 0 },
    refrainOccurrences: { type: "integer", minimum: 0 },
  },
  required: ["stanzas", "stanzaLines", "refrainLines", "refrainOccurrences"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stanzaLineTotal: { type: "integer" },
    refrainLineTotal: { type: "integer" },
    totalLines: { type: "integer" },
    refrainFraction: { type: "number" },
  },
  required: [
    "stanzaLineTotal",
    "refrainLineTotal",
    "totalLines",
    "refrainFraction",
  ],
} as const;
/** Calculate public song stanza refrain count balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stanzas, stanzaLines, refrainLines, refrainOccurrences } = request;
  const compute = (): Output => {
    H.integer(stanzas, 0);
    H.integer(stanzaLines, 0);
    H.integer(refrainLines, 0);
    H.integer(refrainOccurrences, 0);
    H.domain(stanzas * stanzaLines + refrainLines * refrainOccurrences > 0);
    return {
      stanzaLineTotal: stanzas * stanzaLines,
      refrainLineTotal: refrainLines * refrainOccurrences,
      totalLines: stanzas * stanzaLines + refrainLines * refrainOccurrences,
      refrainFraction:
        (refrainLines * refrainOccurrences) /
        (stanzas * stanzaLines + refrainLines * refrainOccurrences),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stanzas: 3, stanzaLines: 4, refrainLines: 2, refrainOccurrences: 3 },
  output: {
    stanzaLineTotal: 12,
    refrainLineTotal: 6,
    totalLines: 18,
    refrainFraction: 0.3333333333333333,
  },
} satisfies ToolExample<Input, Output>;
export const publicSongStanzaRefrainCountBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ethnomusicology/public-song-stanza-refrain-count-balance",
      title: "Public Song Stanza Refrain Count Balance Tool",
      description:
        "Calculate public song stanza refrain count balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stanzas: { type: "integer", minimum: 0 },
          stanzaLines: { type: "integer", minimum: 0 },
          refrainLines: { type: "integer", minimum: 0 },
          refrainOccurrences: { type: "integer", minimum: 0 },
        },
        required: [
          "stanzas",
          "stanzaLines",
          "refrainLines",
          "refrainOccurrences",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stanzaLineTotal: { type: "integer" },
          refrainLineTotal: { type: "integer" },
          totalLines: { type: "integer" },
          refrainFraction: { type: "number" },
        },
        required: [
          "stanzaLineTotal",
          "refrainLineTotal",
          "totalLines",
          "refrainFraction",
        ],
      },
      ports: {
        inputs: [
          {
            id: "stanzas",
            label: "Stanzas",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "stanzaLines",
            label: "Stanza Lines",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "refrainLines",
            label: "Refrain Lines",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "refrainOccurrences",
            label: "Refrain Occurrences",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "stanzaLineTotal",
            label: "Stanza Line Total",
            valueType: { type: "integer" },
          },
          {
            id: "refrainLineTotal",
            label: "Refrain Line Total",
            valueType: { type: "integer" },
          },
          {
            id: "totalLines",
            label: "Total Lines",
            valueType: { type: "integer" },
          },
          {
            id: "refrainFraction",
            label: "Refrain Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = publicSongStanzaRefrainCountBalanceTool.execute;
export default publicSongStanzaRefrainCountBalanceTool;
