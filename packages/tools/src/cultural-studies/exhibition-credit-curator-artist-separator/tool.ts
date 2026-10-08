import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly curatorName: string;
  readonly artistName: string;
  readonly separator: string;
};
export type Output = { readonly creditLine: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    curatorName: { type: "string", maxLength: 8192, minLength: 1 },
    artistName: { type: "string", maxLength: 8192, minLength: 1 },
    separator: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["curatorName", "artistName", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { creditLine: { type: "string", maxLength: 8192 } },
  required: ["creditLine"],
} as const;
/** Join explicitly supplied curator and artist credit strings with a caller-selected separator without assigning authorship. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { curatorName, artistName, separator } = request;
  const compute = (): Output => {
    H.domain(
      curatorName.length > 0 && artistName.length > 0 && separator.length > 0,
      "curatorName",
    );
    return { creditLine: curatorName + separator + artistName };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { curatorName: "Curator A", artistName: "Artist B", separator: " / " },
  output: { creditLine: "Curator A / Artist B" },
} satisfies ToolExample<Input, Output>;
export const exhibitionCreditCuratorArtistSeparatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["cultural-studies", "cultural studies", "humanities"],
        keywords: ["cultural studies", "humanities"],
      },
      id: "cultural-studies/exhibition-credit-curator-artist-separator",
      title: "Exhibition Credit Curator Artist Separator",
      description:
        "Join explicitly supplied curator and artist credit strings with a caller-selected separator without assigning authorship.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          curatorName: { type: "string", maxLength: 8192, minLength: 1 },
          artistName: { type: "string", maxLength: 8192, minLength: 1 },
          separator: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["curatorName", "artistName", "separator"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { creditLine: { type: "string", maxLength: 8192 } },
        required: ["creditLine"],
      },
      ports: {
        inputs: [
          {
            id: "curatorName",
            label: "Curator Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "artistName",
            label: "Artist Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "separator",
            label: "Separator",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "creditLine",
            label: "Credit Line",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = exhibitionCreditCuratorArtistSeparatorTool.execute;
export default exhibitionCreditCuratorArtistSeparatorTool;
