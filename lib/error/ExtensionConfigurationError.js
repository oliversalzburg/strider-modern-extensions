'use strict';

const StriderExtensionError = require('./StriderExtensionError');

/**
 * Thrown when a modern Strider extension encounters an error in its configuration.
 */
class ExtensionConfigurationError extends StriderExtensionError {
  /**
   * Constructs a new ExtensionConfigurationError.
   * @param {String} configurationElement The name of the configuration element that caused the error.
   * @param {String} [userFriendlyErrorMessage] An optional user-friendly message that will be attached to the Error and which is allowed to be propagated to the frontend.
   * @param {Number} [status=500] The HTTP status code that should be associated with this error.
   */
  constructor(configurationElement, userFriendlyErrorMessage, status) {
    super(`Invalid configuration for element '${configurationElement}'`, configurationElement, userFriendlyErrorMessage || `Invalid configuration for element '${configurationElement}'`, status || 400);

    this.name = 'ExtensionConfigurationError';

    // Capture a new stacktrace, otherwise it will include our base-class constructor instead of the code
    // location we're actually interested in.
    Error.captureStackTrace(this, ExtensionConfigurationError);
  }
}

module.exports = ExtensionConfigurationError;
