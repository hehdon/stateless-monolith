import fs from 'fs';
import Joi from 'joi';
import YAML from 'yaml';

const createSchema = (providers = []) => Joi.object({
  anime: Joi.array().items(
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
        file: Joi.string()
      }).required(),
      ...Object.fromEntries(providers.map(v => [v.slug, v.schema])),
    }).xor(...providers.map(v => v.slug))
  ).required()
});

export async function loadConfig(providers) {
  const file = await fs.promises.readFile(process.env.HEHDON_CONFIG ?? './config.yml');
  const yaml = YAML.parse(file.toString());

  return createSchema(providers).validateAsync(yaml);
}
