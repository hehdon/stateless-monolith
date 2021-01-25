const fs = require('fs');
const Joi = require('joi');
const YAML = require('yaml');
const provider = require('./provider');

const schema = Joi.object({
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
      ...Object.fromEntries(provider.map(v => [v.slug, v.schema])),
    }).xor(...provider.map(v => v.slug))
  ).required()
});

const { value: config, error } = schema.validate(
  YAML.parse(
    fs.readFileSync(process.env.ANIMED_CONFIG ?? './config.yml').toString()
  )
);

if (error) {
  console.error(error.message);
  process.exit(1);
}

config.anime.forEach(a => a.$provider = provider.find(v => v.slug in a));

module.exports = config;