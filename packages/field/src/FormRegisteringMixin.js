import { dedupeMixin } from '@lion/core';
import { formRegistrarManager } from './formRegistrarManager.js';

/**
 * #FormRegisteringMixin:
 *
 * This Mixin registers a form element to a Registrar
 *
 * @polymerMixin
 * @mixinFunction
 */
export const FormRegisteringMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-shadow, no-unused-vars
    class FormRegisteringMixin extends superclass {
      connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback();
        }
        this.__setupRegistrationHook();
      }

      disconnectedCallback() {
        if (super.disconnectedCallback) {
          super.disconnectedCallback();
        }
        formRegistrarManager.removeEventListener(
          'all-forms-open-for-registration',
          this._dispatchRegistration,
        );
        this._unregisterFormElement();
      }

      __setupRegistrationHook() {
        if (formRegistrarManager.ready) {
          this._dispatchRegistration();
        } else {
          formRegistrarManager.addEventListener(
            'all-forms-open-for-registration',
            this._dispatchRegistration,
          );
        }
      }

      _dispatchRegistration() {
        this.dispatchEvent(
          new CustomEvent('form-element-register', {
            detail: { element: this },
            bubbles: true,
          }),
        );
      }

      _unregisterFormElement() {
        if (this.__parentFormGroup) {
          this.__parentFormGroup.removeFormElement(this);
        }
      }
    },
);
