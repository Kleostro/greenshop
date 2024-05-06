import type { InputFieldParams, InputFieldValidatorParams } from '@/shared/types/form.ts';

import InputFieldValidatorModel from '@/features/InputFieldValidator/model/InputFieldValidatorModel.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { EVENT_NAME } from '@/shared/constants/events.ts';
import { INPUT_TYPE, PASSWORD_TEXT } from '@/shared/constants/forms.ts';

import InputFieldView from '../view/InputFieldView.ts';

class InputFieldModel {
  private isValid = false;

  private validator: InputFieldValidatorModel | null = null;

  private view: InputFieldView;

  constructor(inputFieldParams: InputFieldParams, validParams: InputFieldValidatorParams | null) {
    this.view = new InputFieldView(inputFieldParams);

    if (validParams) {
      this.validator = new InputFieldValidatorModel(validParams, this.isValid);
      this.setInputHandler();
    }

    observeStore(selectCurrentLanguage, () => this.inputHandler());

    this.setSwitchPasswordVisibilityHandler();
  }

  private inputHandler(): boolean {
    const errorField = this.view.getErrorField();
    const errors = this.validator?.validate(this.view.getValue());
    if (errors === true) {
      if (errorField) {
        errorField.textContent = '';
      }
      this.isValid = true;
    } else {
      if (errorField && errors) {
        const [firstError] = errors;
        errorField.textContent = firstError;
      }
      this.isValid = false;
    }

    return true;
  }

  private setInputHandler(): boolean {
    const input = this.view.getInput().getHTML();
    input.addEventListener(EVENT_NAME.INPUT, () => this.inputHandler());

    return true;
  }

  private setSwitchPasswordVisibilityHandler(): boolean {
    const button = this.view.getShowPasswordButton().getHTML();
    button.addEventListener(EVENT_NAME.CLICK, () => this.switchPasswordVisibilityHandler());
    return true;
  }

  private switchPasswordVisibilityHandler(): boolean {
    const input = this.view.getInput().getHTML();
    input.type = input.type === INPUT_TYPE.PASSWORD ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD;
    input.placeholder = input.type === INPUT_TYPE.PASSWORD ? PASSWORD_TEXT.HIDDEN : PASSWORD_TEXT.SHOWN;
    this.view.switchPasswordButtonSVG(input.type);
    return true;
  }

  public getIsValid(): boolean {
    return this.isValid;
  }

  public getView(): InputFieldView {
    return this.view;
  }
}

export default InputFieldModel;