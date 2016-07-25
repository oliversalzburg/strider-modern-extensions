'use strict';

/**
 * Base class for errors thrown by modern Strider extensions.
 */
class StriderExtensionError extends Error {
  /**
   * Constructs a new StriderExtensionError.
   * @param {String} message The main error message.
   * @param {Number} [status=500] The HTTP status code that should be associated with this error.
   * @param {String} [userFriendlyErrorMessage] An optional user-friendly message that will be attached to the Error and which is allowed to be propagated to the frontend.
   */
  constructor(message, status, userFriendlyErrorMessage) {
    super(message);

    this.name = 'StriderExtensionError';
    this.status = status || 500;
    this.inner = null;

    if (userFriendlyErrorMessage) {
      this.info = userFriendlyErrorMessage;
    }

    // Capture a new stacktrace, otherwise it will include our base-class constructor instead of the code
    // location we're actually interested in.
    Error.captureStackTrace(this, StriderExtensionError);
  }
}

module.exports = StriderExtensionError;
