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
  bounded,
  boolean,
} from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { token } from "../m500b-web-json-protocol.js";
import { calculateContentTypeParser } from "../../http/content-type-parser/tool.js";
export type HttpContentTypeParameterCorpusInput = {
  readonly mediaTypes: readonly string[];
  readonly parameters: readonly {
    readonly name: string;
    readonly values: readonly string[];
  }[];
  readonly duplicateControl: boolean;
  readonly count: number;
  readonly seed?: number;
};
export type HttpContentTypeParameterCorpusOutput = {
  readonly cases: readonly {
    readonly header: string;
    readonly accepted: boolean;
    readonly mediaType: string;
    readonly parameters: readonly {
      readonly name: string;
      readonly value: string;
    }[];
    readonly errorCode: string;
  }[];
  readonly randomness: GeneratorReplay;
};
const parsedParameter = object({ name: text, value: text });
export const inputSchema = object(
  {
    mediaTypes: array(text, 16, 1),
    parameters: array(object({ name: text, values: array(text, 16, 1) }), 8, 1),
    duplicateControl: boolean,
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["mediaTypes", "parameters", "duplicateControl", "count"],
);
export const outputSchema = object({
  cases: array(
    object({
      header: text,
      accepted: boolean,
      mediaType: text,
      parameters: array(parsedParameter, 9),
      errorCode: text,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is HttpContentTypeParameterCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateHttpContentTypeParameterCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HttpContentTypeParameterCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    for (const media of input.mediaTypes)
      if (
        !calculateContentTypeParser({ header: media }).ok ||
        media.includes(";")
      )
        simpleError(
          "mediaTypes",
          "Supply plain supported media types.",
          "invalid_media_type",
        );
    if (
      input.parameters.some(
        (p) =>
          !token.test(p.name) ||
          p.values.some((v) => /[^\t\x20-\x7e\x80-\xff]/u.test(v)),
      )
    )
      simpleError(
        "parameters",
        "Use HTTP parameter names and quoted-string characters.",
        "invalid_parameter",
      );
    const random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.count }, () => {
      const media = pick(input.mediaTypes, random),
        params = input.parameters.map((p) => ({
          name: p.name,
          value: pick(p.values, random),
        }));
      const rendered = params.map(
        (p) =>
          p.name +
          "=" +
          (token.test(p.value)
            ? p.value
            : '"' + p.value.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"'),
      );
      if (input.duplicateControl) rendered.push(rendered[0] ?? "");
      const header = media + "; " + rendered.join("; "),
        r = calculateContentTypeParser({ header });
      return r.ok
        ? { header, accepted: true, ...r.output, errorCode: "" }
        : {
            header,
            accepted: false,
            mediaType: "",
            parameters: [],
            errorCode: r.error.issues[0]?.code ?? "invalid_input",
          };
    });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const httpContentTypeParameterCorpusExample = {
  input: {
    mediaTypes: ["text/plain"],
    parameters: [{ name: "charset", values: ["utf 8"] }],
    duplicateControl: false,
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        header: 'text/plain; charset="utf 8"',
        accepted: true,
        mediaType: "text/plain",
        parameters: [{ name: "charset", value: "utf 8" }],
        errorCode: "",
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  HttpContentTypeParameterCorpusInput,
  HttpContentTypeParameterCorpusOutput
>;
export const httpContentTypeParameterCorpusTool = createModelDefinition<
  HttpContentTypeParameterCorpusInput,
  HttpContentTypeParameterCorpusOutput
>({
  id: "random/http-content-type-parameter-corpus",
  title: "Random HTTP Content Type Parameter Corpus Generator",
  description:
    "Construct caller-supplied media types with escaped parameter quoting and duplicate-name controls, retaining delegated parse results.",
  inputSchema,
  outputSchema,
  execute: calculateHttpContentTypeParameterCorpus,
});
export const runHttpContentTypeParameterCorpus =
  httpContentTypeParameterCorpusTool.execute;
export default httpContentTypeParameterCorpusTool;
