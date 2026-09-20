import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { budget as fixtureBudget } from "../m500b-web-json-json.js";
import {
  object,
  array,
  text,
  label,
  bounded,
  boolean,
} from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { coreOutput } from "../m500b-web-json-protocol.js";
import { calculateMultipartBoundaryGenerator } from "../../web/multipart-boundary-generator/tool.js";
export type MultipartFormMessageFixtureInput = {
  readonly fields: readonly {
    readonly name: string;
    readonly values: readonly string[];
  }[];
  readonly collisionControl: boolean;
  readonly seed?: number;
};
export type MultipartFormMessageFixtureOutput = {
  readonly boundary: string;
  readonly body: string;
  readonly collides: boolean;
  readonly ambiguous: boolean;
  readonly parts: readonly { readonly name: string; readonly value: string }[];
  readonly parsedParts: readonly {
    readonly name: string;
    readonly value: string;
  }[];
  readonly randomness: GeneratorReplay;
};
const part = object({ name: text, value: text });
export const inputSchema = object(
  {
    fields: array(object({ name: label, values: array(text, 16, 1) }), 16, 1),
    collisionControl: boolean,
    seed: generatorSeedSchema,
  },
  ["fields", "collisionControl"],
);
export const outputSchema = object({
  boundary: text,
  body: text,
  collides: boolean,
  ambiguous: boolean,
  parts: array(part, 16, 1),
  parsedParts: array(part, 16),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is MultipartFormMessageFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateMultipartFormMessageFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MultipartFormMessageFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    if (input.fields.some((f) => !/^[A-Za-z0-9_-]+(?![\s\S])/u.test(f.name)))
      simpleError(
        "fields",
        "Use ASCII field names without header syntax.",
        "invalid_field_name",
      );
    const random = createGeneratorRandom(input.seed, context),
      entropyBytes = Array.from({ length: 8 }, () => random.integer(0, 255)),
      boundary = coreOutput(
        calculateMultipartBoundaryGenerator({ entropyBytes, body: "" }),
      ).boundary;
    const parts = input.fields.map((f, i) => ({
      name: f.name,
      value:
        pick(f.values, random) +
        (input.collisionControl && i === 0
          ? "\r\n--" + boundary + "\r\nplanted"
          : ""),
    }));
    const collides = parts.some(
      (p) =>
        coreOutput(
          calculateMultipartBoundaryGenerator({ entropyBytes, body: p.value }),
        ).collides,
    );
    const body =
      parts
        .map(
          (p) =>
            "--" +
            boundary +
            '\r\nContent-Disposition: form-data; name="' +
            p.name +
            '"\r\n\r\n' +
            p.value +
            "\r\n",
        )
        .join("") +
      "--" +
      boundary +
      "--\r\n";
    const parsedParts: { name: string; value: string }[] = [];
    if (!collides) {
      const prefix = "--" + boundary + "\r\n",
        suffix = "\r\n--" + boundary + "--\r\n",
        payload = body.slice(prefix.length, -suffix.length);
      for (const block of payload.split("\r\n--" + boundary + "\r\n")) {
        const end = block.indexOf("\r\n\r\n"),
          header = block.slice(0, end),
          match =
            /^Content-Disposition: form-data; name="([A-Za-z0-9_-]+)"(?![\s\S])/u.exec(
              header,
            );
        if (!match)
          throw new Error("Generated part header failed bounded parser");
        parsedParts.push({ name: match[1] ?? "", value: block.slice(end + 4) });
      }
    }
    return toolSuccess({
      boundary,
      body,
      collides,
      ambiguous: collides,
      parts,
      parsedParts,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const multipartFormMessageFixtureExample = {
  input: {
    fields: [{ name: "note", values: ["hello"] }],
    collisionControl: false,
    seed: 42,
  },
  output: {
    boundary: "toolio-9972daab2c86459f",
    body: '--toolio-9972daab2c86459f\r\nContent-Disposition: form-data; name="note"\r\n\r\nhello\r\n--toolio-9972daab2c86459f--\r\n',
    collides: false,
    ambiguous: false,
    parts: [{ name: "note", value: "hello" }],
    parsedParts: [{ name: "note", value: "hello" }],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  MultipartFormMessageFixtureInput,
  MultipartFormMessageFixtureOutput
>;
export const multipartFormMessageFixtureTool = createModelDefinition<
  MultipartFormMessageFixtureInput,
  MultipartFormMessageFixtureOutput
>({
  id: "random/multipart-form-message-fixture",
  title: "Random Multipart Form Message Fixture Generator",
  description:
    "Construct bounded CRLF text form parts and deliberate delimiter collisions, reporting ambiguity and parsing the collision-free generated grammar.",
  inputSchema,
  outputSchema,
  execute: calculateMultipartFormMessageFixture,
});
export const runMultipartFormMessageFixture =
  multipartFormMessageFixtureTool.execute;
export default multipartFormMessageFixtureTool;
