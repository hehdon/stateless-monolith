import fs from 'fs';
import Joi from 'joi';
import YAML from 'yaml';

const createSchema = (providers = []) => Joi.array().items(
  Joi.object({
    name: Joi.string().required(),
    filter: Joi.object({
      start: Joi.number().integer(),
      end: Joi.number().integer(),
      exclude: Joi.array().items(Joi.number()),
      include: Joi.array().items(Joi.number(), Joi.string()),
    }),
    storage: Joi.object({
      dir: Joi.string().required(),
      prefix: Joi.string()
    }).required(),
    ...Object.fromEntries(providers.map(v => [v.slug, v.schema])),
  }).xor(...providers.map(v => v.slug))
);

export async function loadConfig(providers) {
  const file = await fs.promises.readFile(process.env.HEHDON_CONFIG ?? './config.yml');
  const yaml = YAML.parseAllDocuments(file.toString()).map(d => d.toJSON());

  return createSchema(providers).validateAsync(yaml);
}
