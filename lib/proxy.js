'use strict';

const debug = require('debug')('strider-modern-extensions:proxy');
const errors = require('./error');

module.exports = toStriderProxy;

/**
 * Given an input object, replaces all functions on that object with node-style callback equivalents.
 * The methods are expected to return promises. It's kind of like a reverse-promisifyAll.
 * The original methods are available by their old name with "Async" appended.
 * @param {Object} instance
 * @returns {Object}
 */
function toStriderProxy(instance) {
  debug(`Proxying async plugin: ${instance.constructor.name}`);

  const functionsInInstance = Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).filter(propertyName => {
    return typeof instance[propertyName] === 'function' && propertyName !== 'constructor';
  });

  functionsInInstance.forEach(functionInInstance => {
    instance[`${functionInInstance}Async`] = instance[functionInInstance];
    instance[functionInInstance] = function () {
      const args = Array.from(arguments);
      const done = args.pop();
      return instance[`${functionInInstance}Async`].apply(instance, args)
        .then(result => done(null, result))
        .catch(errors.ExtensionConfigurationError, error => {
          debug(`Extension configuration error:${error.message}` || error.info);
          return done(error);
        })
        .catch(error => done(error));
    };
    Object.defineProperty(instance[functionInInstance], 'length', {
      value: instance[`${functionInInstance}Async`].length
    });
  });

  return instance;
}
