import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { ArgLabel } from './arg_label';
import { ArgSimpleForm } from './arg_simple_form';
import { SimpleFailure } from './simple_failure';
import { AdvancedFailure } from './advanced_failure';
import { RenderError } from '../../lib/errors';
import './arg_form.less';

// This is what is being generated by render() from the Arg class. It is called in FunctionForm
export const ArgForm = (props) => {
  const {
    argTypeInstance,
    templateProps,
    error,
    valueMissing,
    resetErrorState,
    label,
    setLabel,
    expand,
    setExpand,
    onValueRemove,
  } = props;

  const getTemplates = () => {
    const { template, simpleTemplate } = argTypeInstance.argType;
    const argumentProps = {
      ...templateProps,
      defaultValue: argTypeInstance.defaultValue,
      renderError: (msg) => { throw new RenderError(msg || 'Render failed'); },
      setLabel,
      resetErrorState,
      label,
    };

    if (error) {
      return {
        simpleForm: createElement(SimpleFailure, argumentProps),
        advancedForm: createElement(AdvancedFailure, argumentProps),
      };
    }

    return {
      simpleForm: simpleTemplate && createElement(simpleTemplate, argumentProps),
      advancedForm: template && createElement(template, argumentProps),
    };
  };

  const { simpleForm, advancedForm } = getTemplates();
  const expandableLabel = Boolean(simpleForm && advancedForm);

  return (
    <div className="canvas__arg">
      <div className="canvas__arg--header">
        <ArgLabel
          label={label}
          description={argTypeInstance.description}
          expandable={expandableLabel || error}
          expanded={expand}
          setExpand={setExpand}
        />

        <ArgSimpleForm
          required={argTypeInstance.required}
          valueMissing={valueMissing}
          onRemove={onValueRemove}
        >
          { simpleForm }
        </ArgSimpleForm>
      </div>

      <div
        className="canvas__arg--controls"
        style={{ display: (advancedForm && (expand || !simpleForm)) ? 'block' : 'none' }}
      >
        { advancedForm }
      </div>
    </div>
  );
};

ArgForm.propTypes = {
  argTypeInstance: PropTypes.object,
  templateProps: PropTypes.object,
  error: PropTypes.object,
  valueMissing: PropTypes.bool,
  resetErrorState: PropTypes.func.isRequired,
  label: PropTypes.string,
  setLabel: PropTypes.func.isRequired,
  expand: PropTypes.bool,
  setExpand: PropTypes.func,
  onValueRemove: PropTypes.func,
};
